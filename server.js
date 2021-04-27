const formidable = require("formidable");
const { copyFile, unlink } = require("fs");

const jsonServer = require("json-server");
const { authenticate, isAuthenticated } = require("./jwt-authenticate");
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

// Register request
server.post("/register", (req, res, next) => {
  const lastUser = db.get("users").maxBy("id").value();
  const newUserId = parseInt(lastUser.id) + 1;
  const newUser = { id: newUserId, ...req.body };

  db.get("users").push(newUser).write();

  res.jsonp(newUser);
});

// Login in request
server.post("/login", (req, res, next) => {
  authenticate(req.body)
    .then((user) =>
      user
        ? res.jsonp(user)
        : res.status(400).jsonp({ message: "Email or password is incorrect!" })
    )
    .catch((err) => next(err));
});

// Upload files
server.post("/upload", (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      res.end(String(err));
      return;
    }

    const file = files.file;

    copyFile(file.path, "./public/upload/" + file.name, (err) => {
      if (err) throw err;

      unlink(file.path, (err) => {
        if (err) console.log(err);
      });

      files.file.path = "/" + file.name;
      res.jsonp(files);
    });
  });
});

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
