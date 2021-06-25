const { format } = require("date-fns");

const jsonServer = require("json-server");
const { isAuthenticated } = require("./jwt-authenticate");
const {
  loginHandler,
  uploadFileHandler,
  uploadFilesHandler,
  uploadImageHandler,
  registerHandler,
} = require("./additional_routes");
const { defaultPort, databaseFile, jwtSecret } = require("./config.json");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync(databaseFile);
const db = low(adapter);

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();
const port = process.env.PORT || defaultPort;

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Handle POST, PUT and PATCH request
server.use(jsonServer.bodyParser);

// Save createdAt and updatedAt automatically
server.use((req, res, next) => {
  const currentTime = Date.now();

  if (req.method === "POST") {
    req.body.createdAt = currentTime;
    req.body.modifiedAt = currentTime;
  } else if (["PUT", "PATCH"].includes(req.method)) {
    req.body.modifiedAt = currentTime;
  }

  next();
});

// Register request
server.post("/register", (req, res) => {
  registerHandler(db, req, res);
});

// Login in request
server.post("/login", (req, res) => {
  loginHandler(db, req, res);
});

// Upload 1 file
server.post("/upload-file", uploadFileHandler);

// Upload multiple files
server.post("/upload-files", uploadFilesHandler);

// Access control
server.use((req, res, next) => {
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
server.use(router);

// Start server
server.listen(port, () => {
  console.log("Server is running on port " + port);
});
