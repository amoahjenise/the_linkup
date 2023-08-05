const multer = require("multer");
const path = require("path");

// Save the avatar image to a secure location on the server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Use 'path.join' to properly set the destination path
  },
  filename: function (req, file, cb) {
    const uniqueFileName = Date.now() + "-" + file.originalname;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage }).single("avatar"); // Use "avatar" instead of "image" for the field name

module.exports = upload;
