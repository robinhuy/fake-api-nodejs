import {graphqlHTTP} from "express-graphql";
import http from "http";
import jsonServer from "json-server";
import {Low} from "lowdb";
import {JSONFile} from "lowdb/node";
import {Server} from "socket.io";

import {CONFIG} from "./config.js";
import {isAuthenticated} from "./utils/jwt-authenticate.js";
import {schema, setupRootValue} from "./src/graphql.js";
import {
  loginHandler,
  registerHandler,
  renewTokenHandler,
  socketEmit,
  testHandler,
  uploadFileHandler,
  uploadFilesHandler,
} from "./src/rest.js";
import socketHandler from "./src/socket-io.js";

const db = new Low(new JSONFile(CONFIG.databaseFile));
await db.read();

const app = jsonServer.create();
const router = jsonServer.router(CONFIG.databaseFile);
const middlewares = jsonServer.defaults();
const port = process.env.PORT || CONFIG.defaultPort;
const server = http.createServer(app);

// Init socket io server
const io = new Server(server, {
  cors: {origin: "*"},
});
io.on("connection", (socket) => {
  socketHandler(socket, io);
});

// Init graphql
app.use("/graphql", graphqlHTTP({schema, rootValue: setupRootValue(db), graphiql: true}));

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

// Test request (change the response in src/rest.js)
app.get("/test", (req, res) => {
  testHandler(db, req, res);
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
  const protectedResources = db.data.protected_resources;
  if (!protectedResources) {
    next();
    return;
  }

  const resource = req.path.slice(1).split("/")[0];
  const protectedResource =
    protectedResources[resource] && protectedResources[resource].map((item) => item.toUpperCase());
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
