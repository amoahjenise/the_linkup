const express = require("express");
const router = express.Router();
const messagingController = require("../controllers/messagingController");

router.post("/send-message", messagingController.sendMessage);
router.post("/create-conversation", messagingController.createNewConversation);
router.get("/conversations/:userId", messagingController.getConversations);
router.get(
  "/conversation/messages/:conversationId/:userId",
  messagingController.getMessagesForConversation
);

// router.post("/mark-as-read", messagingController.markAsRead);

module.exports = router;
