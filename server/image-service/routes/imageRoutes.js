const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

router.get("/get-images", imageController.getImages);
router.post("/upload-images", imageController.uploadImages);
router.post("/delete-images", imageController.deleteImages);

module.exports = router;
