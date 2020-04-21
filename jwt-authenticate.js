const jwt = require("jsonwebtoken");

const jwtSecret = "robin";
const users = [
  {
    id: 1,
    username: "test",
    password: "test",
    firstName: "Test",
    lastName: "User",
  },
];

async function authenticate({ username, password }) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = jwt.sign({ sub: user.id }, jwtSecret);
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token,
    };
  }
}

function isAuthenticated(req) {
  let token, decoded;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    return false;
  }

  return true;
}

module.exports = {
  authenticate,
  isAuthenticated,
};
