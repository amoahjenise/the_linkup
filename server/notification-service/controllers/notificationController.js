const { pool } = require("../db");
const fs = require("fs");
const path = require("path");

const getUnreadNotificationsCount = async (req, res) => {
  const { userId } = req.query; // Assuming you pass the user's ID as a query parameter

  const queryPath = path.join(
    __dirname,
    "../db/queries/getUnreadNotificationsCount.sql"
  );
  const query = fs.readFileSync(queryPath, "utf8");
  const values = [userId];

  try {
    const { rows } = await pool.query(query, values);
    res.json({ unreadCount: rows[0].unread_count }); // Send the unread count as response
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch unread notifications count" });
  }
};

const getNotifications = async (req, res) => {
  const { userId } = req.query; // Use req.query to access query parameters
  const queryPath = path.join(__dirname, "../db/queries/getNotifications.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const values = [userId];

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows); // Send the response back to the client
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({ error: "Failed to fetch unread notifications" });
  }
};

const createNotification = async (req, res) => {
  const { creatorId, requesterId, type, content, linkupId, linkupRequestId } =
    req.body;

  const queryPath = path.join(
    __dirname,
    "../db/queries/createNotification.sql"
  );

  const query = fs.readFileSync(queryPath, "utf8");

  const values = [
    creatorId,
    requesterId,
    type,
    content,
    linkupId,
    linkupRequestId,
  ];

  try {
    const { rows } = await pool.query(query, values);
    res.json({
      success: true,
      message: "Notification posted successfully",
      notificationId: rows[0].id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to post notification",
      error: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1;
  `;

  const values = [notificationId];
  try {
    const { rows } = await pool.query(query, values);
    res.json({
      success: true,
      message: "Notification marked as read successfully",
      notification: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

module.exports = {
  getUnreadNotificationsCount,
  createNotification,
  getNotifications,
  markNotificationAsRead,
};
