const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/post-notification", notificationController.createNotification);
router.post(
  "/mark-as-read/:notificationId",
  notificationController.markNotificationAsRead
);
router.get("/get-notifications", notificationController.getNotifications);
router.get(
  "/get-unread-notifications-count",
  notificationController.getUnreadNotificationsCount
);

module.exports = router;
