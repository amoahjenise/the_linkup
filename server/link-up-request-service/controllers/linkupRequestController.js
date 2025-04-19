require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const axios = require("axios");
const io = require("socket.io-client");

const linkupSocket = io("http://localhost:5000/linkup-management"); // Initialize socket connection to notification service

let linkupRequestSocket;

// Function to initialize the Socket.IO instance
const initializeSocket = (io) => {
  linkupRequestSocket = io;
};

// Environment variables
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;
const MESSAGING_SERVICE_URL = process.env.MESSAGING_SERVICE_URL;

const sendRequest = async (req, res) => {
  const {
    requesterId,
    requesterName,
    creator_id,
    linkupId,
    content,
    conversation_id,
  } = req.body;

  const checkQueryPath = path.join(
    __dirname,
    "../db/queries/getRequestByLinkupidAndSenderid.sql"
  );
  const checkQuery = fs.readFileSync(checkQueryPath, "utf8");
  const checkValues = [linkupId, requesterId];

  try {
    // Check if a request already exists
    const existing = await pool.query(checkQuery, checkValues);

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already sent a request for this linkup.",
      });
    }

    const queryPath = path.join(__dirname, "../db/queries/sendRequest.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const queryValues = [requesterId, creator_id, linkupId, content];

    // Post Linkup Request
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      // Save new conversation in db
      const conversationData = {
        sender_id: requesterId,
        receiver_id: creator_id,
        conversation_id: conversation_id,
        linkup_id: linkupId,
      };

      await axios.post(
        `${MESSAGING_SERVICE_URL}/create-conversation`,
        conversationData
      );

      // Notification
      const notificationData = {
        creatorId: creator_id,
        requesterId: requesterId,
        type: "linkup_request",
        linkupId: linkupId,
        content: `New linkup request from ${requesterName}`,
        linkupRequestId: rows[0].id,
      };

      const notificationResponse = await axios.post(
        `${NOTIFICATION_SERVICE_URL}/post-notification`,
        notificationData
      );

      const notificationId = notificationResponse.data.notificationId;

      if (notificationId) {
        try {
          // Emit socket events
          linkupRequestSocket
            .to(`user-${creator_id}`)
            .emit("new-linkup-request", {
              ...notificationData,
              notificationId,
            });

          console.log("Event emitted: new-linkup-request");

          linkupRequestSocket
            .to(`user-${requesterId}`)
            .emit("join-linkup-room", linkupId);

          console.log("Event emitted: join-linkup-room");

          res.json({
            success: true,
            message: "Request sent successfully",
            linkupRequest: rows[0],
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: "Failed to emit notification event",
            error: error.message,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to request linkup",
      error: error.message,
    });
  }
};

const acceptRequest = async (req, res) => {
  const { linkupRequestId } = req.params;
  const queryPath = path.join(__dirname, "../db/queries/acceptRequest.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [linkupRequestId];

  try {
    const { rows } = await pool.query(query, queryValues);
    if (rows.length > 0) {
      const linkupRequest = rows[0];

      // Post Notification
      const notificationData = {
        creatorId: linkupRequest.requester_id,
        requesterId: linkupRequest.requester_id,
        type: "linkup_request_action",
        linkupId: linkupRequest.linkup_id,
        content: `${linkupRequest.creator_name} accepted your request for ${linkupRequest.activity}.`,
        linkupRequestId: linkupRequestId,
      };

      const notificationResponse = await axios.post(
        `${NOTIFICATION_SERVICE_URL}/post-notification`,
        notificationData
      );

      const notificationId = notificationResponse.data.notificationId;

      if (notificationId) {
        try {
          // Emit request-accepted event
          linkupRequestSocket
            .to(`user-${linkupRequest.requester_id}`)
            .emit("request-accepted", {
              ...notificationData,
              notificationId,
            });

          res.json({
            success: true,
            message: "Approved request successfully",
            linkupRequest: linkupRequest,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: "Failed to emit request-accepted event",
            error: error.message,
          });
        }
      }
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
  const { linkupRequestId } = req.params;
  const queryPath = path.join(__dirname, "../db/queries/declineRequest.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [linkupRequestId];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const linkupRequest = rows[0];

      // Post Notification
      const notificationData = {
        creatorId: linkupRequest.requester_id,
        requesterId: linkupRequest.requester_id,
        type: "linkup_request_action",
        linkupId: linkupRequest.linkup_id,
        content: `${linkupRequest.creator_name} declined your request for ${linkupRequest.activity}.`,
        linkupRequestId: linkupRequestId,
      };

      const notificationResponse = await axios.post(
        `${NOTIFICATION_SERVICE_URL}/post-notification`,
        notificationData
      );

      const notificationId = notificationResponse.data.notificationId;

      if (notificationId) {
        try {
          // Emit request-declined event
          //const linkupRequestNamespace = linkupSocket;
          linkupRequestSocket
            .to(`user-${linkupRequest.requester_id}`)
            .emit("request-declined", {
              ...notificationData,
              notificationId,
            });

          res.json({
            success: true,
            message: "Declined request successfully",
            linkupRequest: linkupRequest,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: "Failed to emit request-declined event",
            error: error.message,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Decline request failed",
      error: error.message,
    });
  }
};

const getLinkupRequests = async (req, res) => {
  const userId = req.params.userId;
  const queryPath = path.join(
    __dirname,
    "../db/queries/getLinkupRequestsByUserId.sql"
  );
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [userId];

  try {
    const { rows } = await pool.query(query, queryValues);

    res.json({
      success: true,
      message:
        rows.length > 0
          ? "Linkup Requests fetched successfully"
          : "No linkup requests in the database",
      linkupRequestList: rows,
    });
  } catch (error) {
    console.error("Error fetching linkup requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch linkup requests",
      error: error.message,
    });
  }
};

const getSentRequests = async (req, res) => {
  const userId = req.params.userId;
  const queryPath = path.join(__dirname, "../db/queries/getSentRequests.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [userId];

  try {
    const { rows } = await pool.query(query, queryValues);

    res.json({
      success: true,
      message:
        rows.length > 0
          ? "Sent requests fetched successfully"
          : "No sent requests in the database",
      linkupRequestList: rows,
    });
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sent requests",
      error: error.message,
    });
  }
};

const getRequestByLinkupidAndSenderid = async (req, res) => {
  const { linkupId, senderId } = req.params;
  const queryPath = path.join(
    __dirname,
    "../db/queries/getRequestByLinkupidAndSenderid.sql"
  );
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [linkupId, senderId];

  try {
    const { rows } = await pool.query(query, queryValues);

    res.json({
      success: true,
      message:
        rows.length > 0 ? "Request fetched successfully" : "No request found",
      linkupRequest: rows[0],
    });
  } catch (error) {
    console.error("Error fetching request by linkupId and senderId:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch request",
      error: error.message,
    });
  }
};

const getReceivedRequests = async (req, res) => {
  const userId = req.params.userId;
  const queryPath = path.join(
    __dirname,
    "../db/queries/getReceivedRequests.sql"
  );
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [userId];

  try {
    const { rows } = await pool.query(query, queryValues);

    res.json({
      success: true,
      message:
        rows.length > 0
          ? "Received requests fetched successfully"
          : "No received requests in the database",
      linkupRequestList: rows,
    });
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch received requests",
      error: error.message,
    });
  }
};

module.exports = {
  initializeSocket,
  sendRequest,
  acceptRequest,
  declineRequest,
  getLinkupRequests,
  getSentRequests,
  getRequestByLinkupidAndSenderid,
  getReceivedRequests,
};
