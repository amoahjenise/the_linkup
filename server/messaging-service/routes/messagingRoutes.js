const express = require("express");
const router = express.Router();
const messagingController = require("../controllers/messagingController");

router.post("/send-message", messagingController.sendmessage);
// router.post("/mark-as-read", messagingController.markAsRead);

module.exports = router;
