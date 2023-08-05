const express = require("express");
const router = express.Router();
const { uploadAvatar } = require("../controllers/avatarController");
const upload = require("../middlewares/multerConfig");

// Route to upload the user's avatar
router.post("/upload-avatar", upload, uploadAvatar); // Use 'upload' middleware before calling 'uploadAvatar'

module.exports = router;
