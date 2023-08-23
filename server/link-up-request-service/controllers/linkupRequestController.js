require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const { getSocketByUserId } = require("../socket/linkupRequestSocket");

// Now you can use the linkupRequestSocket function

let socketIo;

// Function to initialize the Socket.IO instance
const initializeSocket = (io) => {
  socketIo = io;
};

const sendRequest = async (req, res) => {
  const { requesterId, requesterName, creator_id, linkupId, message } =
    req.body;
  const queryPath = path.join(__dirname, "../db/queries/sendRequest.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [requesterId, creator_id, linkupId, message];

  try {
    const { rows } = await pool.query(query, queryValues);

    // Store a notification for the creator

    const notificationQueryPath = path.join(
      __dirname,
      "../../notification-service/db/queries/createNotification.sql"
    );
    const notificationsQuery = fs.readFileSync(notificationQueryPath, "utf8");

    //   const notificationsQuery = `
    //   INSERT INTO notifications (user_id, requester_id, type, content, link_up_id, is_read, created_at, updated_at)
    //   VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())
    //   RETURNING id;
    // `;

    const notificationsValues = [
      creator_id,
      requesterId,
      "link_up_request",
      `New link-up request from ${requesterName}`,
      linkupId,
    ];

    const { NotificationRows } = await pool.query(
      notificationsQuery,
      notificationsValues
    );

    // Emit a real-time event to notify the creator
    const creatorSocket = getSocketByUserId(creator_id);
    if (creatorSocket) {
      creatorSocket.emit("request-sent", {
        requestId: rows[0].id,
        linkupId,
        requesterId,
        message,
      });
    }

    res.json({
      success: true,
      message: "Request sent successfully",
      linkupRequest: rows[0],
    });
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to request link-up",
      error: error.message,
    });
  }
};

const acceptRequest = async (req, res) => {
  const { linkupId } = req.body;
  let queryPath = path.join(__dirname, "../db/queries/acceptRequest.sql");

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [linkupId];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const linkups = rows;
      res.json({
        success: true,
        message: "Approved request successfully",
        linkupList: linkups,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Approve request failed",
      error: error.message,
    });
  }
};

const declineRequest = async (req, res) => {
  const { linkupId } = req.body;
  let queryPath = path.join(__dirname, "../db/queries/declineRequest.sql");

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [linkupId];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const linkups = rows;
      res.json({
        success: true,
        message: "Decline request successfully",
        linkupList: linkups,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Decline request failed",
      error: error.message,
    });
  }
};

module.exports = {
  initializeSocket,
  sendRequest,
  acceptRequest,
  declineRequest,
};
