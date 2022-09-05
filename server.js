const jsonServer = require("json-server");
const http = require("http");
const { graphqlHTTP } = require("express-graphql");
const { schema, setupRootValue } = require("./src/graphql");
const { Server } = require("socket.io");
const socketHandler = require("./src/socket-io");
const {
  loginHandler,
  renewTokenHandler,
  uploadFileHandler,
  uploadFilesHandler,
  registerHandler,
  socketEmit,
} = require("./src/rest");
const { defaultPort, databaseFile } = require("./config.json");
const { isAuthenticated } = require("./jwt-authenticate");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync(databaseFile);
const db = low(adapter);

const app = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();
const port = process.env.PORT || defaultPort;

const server = http.createServer(app);

// Init socket io server
const io = new Server(server, {
  cors: { origin: "*" },
});
io.on("connection", (socket) => {
  socketHandler(socket, io);
});

// Init graphql
app.use(
  "/graphql",
  graphqlHTTP({ schema, rootValue: setupRootValue(db), graphiql: true })
);

// Set default middlewares (logger, static, cors and no-cache)
app.use(middlewares);

// Handle POST, PUT and PATCH request
app.use(jsonServer.bodyParser);

// Save createdAt and updatedAt automatically
app.use((req, res, next) => {
  const currentTime = Date.now();

  if (req.method === "POST") {
    req.body.createdAt = currentTime;
    req.body.modifiedAt = currentTime;
  } else if (["PUT", "PATCH"].includes(req.method)) {
    req.body.modifiedAt = currentTime;
  }

  next();
});

// Test web socket request
app.post("/socket-emit", (req, res) => {
  socketEmit(io, req, res);
});

// Register request
app.post("/register", (req, res) => {
  registerHandler(db, req, res);
});

// Login request
app.post("/login", (req, res) => {
  loginHandler(db, req, res);
});

// Renew Token request
app.post("/renew-token", (req, res) => {
  renewTokenHandler(req, res);
});

// Upload 1 file
app.post("/upload-file", uploadFileHandler);

// Upload multiple files
app.post("/upload-files", uploadFilesHandler);

// Access control
app.use((req, res, next) => {
  const protectedResources = db.get("protected_resources").value();
  if (!protectedResources) {
    next();
    return;
  }

  const resource = req.path.slice(1).split("/")[0];
  const protectedResource =
    protectedResources[resource] &&
    protectedResources[resource].map((item) => item.toUpperCase());
  const reqMethod = req.method.toUpperCase();

  if (protectedResource && protectedResource.includes(reqMethod)) {
    if (isAuthenticated(req)) {
      next();
    } else {
      res.sendStatus(401);
    }
  } else {
    next();
  }
});

// Setup others routes
app.use(router);

// Start server
server.listen(port, () => {
  console.log("Server is running on port " + port);
});
