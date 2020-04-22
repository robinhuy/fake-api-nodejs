const jsonServer = require("json-server");
const {authenticate, isAuthenticated} = require('./jwt-authenticate')
const { databaseFile, jwtSecret } = require("./config.json");
const server = jsonServer.create();
const router = jsonServer.router(databaseFile);
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Handle POST, PUT and PATCH request
server.use(jsonServer.bodyParser);

// Login in request
server.post("/login", (req, res, next) => {
  authenticate(req.body)
    .then((user) =>
      user
        ? res.jsonp(user)
        : res
            .status(400)
            .jsonp({ message: "Email or password is incorrect!" })
    )
    .catch((err) => next(err));
});

server.post("/register", (req, res, next) => {
  
});

// Access control
server.use((req, res, next) => {
  // Protect routes by requests
  const requestMethod = req.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(requestMethod)) {
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
