const express = require("express");
const router = express.Router();
const messagingController = require("../controllers/messagingController");

router.post("/create-conversation", messagingController.createNewConversation);

router.get(
  "/conversation/channel/:channelUrl",
  messagingController.getConversationByChannelUrl
);
router.get(
  "/linkup-by-conversation/:channelUrl",
  messagingController.getLinkupByConversation
);

module.exports = router;
