const formidable = require("formidable");
const { copyFile, unlink } = require("fs/promises");
const {
  generateAccessToken,
  generateRefreshToken,
  decodeRefreshToken,
} = require("./jwt-authenticate");

const handleUploadFile = async (req, file) => {
  const uploadFolder = "uploads";

  try {
    // Copy file from temp folder to uploads folder (not rename to allow cross-device link)
    await copyFile(
      file.filepath,
      `./public/${uploadFolder}/${file.originalFilename}`
    );

    // Remove temp file
    await unlink(file.filepath);

    // Return new path of uploaded file
    file.filepath = `${req.protocol}://${req.get("host")}/${uploadFolder}/${
      file.name
    }`;

    return file;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  loginHandler: (db, req, res) => {
    const { username, email, password: pwd } = req.body;

    const user = db
      .get("users")
      .find(
        (u) =>
          (u.username === username || u.email === email) && u.password === pwd
      )
      .value();

    if (user && user.password === pwd) {
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const { password, ...userWithoutPassword } = user;

      res.jsonp({
        ...userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).jsonp({ message: "Username or password is incorrect!" });
    }
  },

  renewTokenHandler: (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      try {
        const payload = decodeRefreshToken(refreshToken);
        const accessToken = generateAccessToken(payload.sub);

        res.jsonp({
          accessToken,
        });
      } catch (error) {
        res.status(400).jsonp({ error });
      }
    } else {
      res.status(400).jsonp({ message: "Refresh Token is invalid!" });
    }
  },

  registerHandler: (db, req, res) => {
    const { username, email, password } = req.body;

    if (!password && (!email || !username)) {
      res.status(400).jsonp({ message: "Please input all required fields!" });
      return;
    }

    const existUsername = db
      .get("users")
      .find((user) => username && user.username === username)
      .value();

    if (existUsername) {
      res.status(400).jsonp({
        message:
          "The username already exists. Please use a different username!",
      });
      return;
    }

    const existEmail = db
      .get("users")
      .find((user) => email && user.email === email)
      .value();

    if (existEmail) {
      res.status(400).jsonp({
        message:
          "The email address is already being used! Please use a different email!",
      });
      return;
    }

    const lastUser = db.get("users").maxBy("id").value();
    const newUserId = parseInt(lastUser.id, 10) + 1;
    const newUser = { id: newUserId, ...req.body };

    db.get("users").push(newUser).write();

    res.jsonp(newUser);
  },

  uploadFileHandler: (req, res) => {
    if (req.headers["content-type"] === "application/json") {
      res
        .status(400)
        .jsonp({ message: 'Content-Type "application/json" is not allowed.' });
      return;
    }

    const form = formidable();

    form.parse(req, async (error, fields, files) => {
      let file = files.file;

      if (error || !file) {
        res.status(400).jsonp({ message: 'Missing "file" field.' });
        return;
      }

      try {
        file = await handleUploadFile(req, file);
        res.jsonp(file);
      } catch (err) {
        console.log(err);
        res.status(500).jsonp({ message: "Cannot upload file." });
      }
    });
  },

  uploadFilesHandler: (req, res) => {
    if (req.headers["content-type"] === "application/json") {
      res
        .status(400)
        .jsonp({ message: 'Content-Type "application/json" is not allowed.' });
      return;
    }

    const form = formidable({ multiples: true });

    form.parse(req, async (error, fields, files) => {
      let filesUploaded = files.files;

      if (error || !filesUploaded) {
        res.status(400).jsonp({ message: 'Missing "files" field.' });
        return;
      }

      // If user upload 1 file, transform data to array
      if (!Array.isArray(filesUploaded)) {
        filesUploaded = [filesUploaded];
      }

      try {
        // Handle all uploaded files
        filesUploaded = await Promise.all(
          filesUploaded.map(async (file) => {
            try {
              file = await handleUploadFile(req, file);
              return file;
            } catch (err) {
              throw err;
            }
          })
        );

        res.jsonp(filesUploaded);
      } catch (err) {
        console.log(err);
        res.status(500).jsonp({ message: "Cannot upload files." });
      }
    });
  },
};
