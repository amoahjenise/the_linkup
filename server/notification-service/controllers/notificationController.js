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
    console.log("ROWS", JSON.stringify(rows[5]));

    res.json(rows); // Send the response back to the client
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({ error: "Failed to fetch unread notifications" });
  }
};

const createNotification = async (data) => {
  console.log("DATA:", data);

  const { creatorId, requesterId, type, content, linkupId } = data;

  console.log("TYPE:", data);

  const queryPath = path.join(
    __dirname,
    "../db/queries/createNotification.sql"
  );

  const query = fs.readFileSync(queryPath, "utf8");

  const values = [creatorId, requesterId, type, content, linkupId];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0].id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
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
  console.log("Values", values);
  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

module.exports = {
  getUnreadNotificationsCount,
  createNotification,
  getNotifications,
  markNotificationAsRead,
};
