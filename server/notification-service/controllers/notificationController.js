const { pool } = require("../db");
const fs = require("fs");
const path = require("path");

const getUnreadNotifications = async (req, res) => {
  const { requesterId } = req.query; // Use req.query to access query parameters
  const queryPath = path.join(__dirname, "../db/queries/getNotifications.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const values = [requesterId];

  console.log("MADE IT THIS FAR", requesterId);
  try {
    const { rows } = await pool.query(query, values);
    res.json(rows); // Send the response back to the client
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({ error: "Failed to fetch unread notifications" });
  }
};

const createNotification = async (userId, type, content) => {
  const query = `
    INSERT INTO notifications (user_id, type, content, is_read, created_at, updated_at)
    VALUES ($1, $2, $3, false, NOW(), NOW())
    RETURNING id;
  `;

  const values = [userId, type, content];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0].id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

const markNotificationAsRead = async (notificationId) => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1;
  `;

  const values = [notificationId];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getUnreadNotifications,
  markNotificationAsRead,
};
