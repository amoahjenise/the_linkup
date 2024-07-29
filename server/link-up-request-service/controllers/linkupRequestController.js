require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const io = require("socket.io-client");

const LINKUP_MANAGEMENT_SERVICE_URL = process.env.LINKUP_MANAGEMENT_SERVICE_URL;
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;
const MESSAGING_SERVICE_URL = process.env.MESSAGING_SERVICE_URL;

const linkupSocket = io(LINKUP_MANAGEMENT_SERVICE_URL); // Initialize socket connection to notification service

let linkupRequestSocket;

// Function to initialize the Socket.IO instance
const initializeSocket = (io) => {
  linkupRequestSocket = io;
};

const axios = require("axios");

// const {
//   createNotification,
// } = require("../../notification-service/controllers/notificationController");

// const {
//   createNewConversation,
// } = require("../../messaging-service/controllers/messagingController");

const sendRequest = async (req, res) => {
  const {
    requesterId,
    requesterName,
    creator_id,
    linkupId,
    content,
    conversation_id,
  } = req.body;
  const queryPath = path.join(__dirname, "../db/queries/sendRequest.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [requesterId, creator_id, linkupId, content];

  try {
    // Post Linkup Request
    var { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      // Notify all users in the link-up room about a new link-up request
      const roomName = `linkup-${linkupId}`;
      // linkupSocket.to(roomName).emit("new-linkup-request", notificationData);

      // Create a new conversation

      // Post Notification
      const conversationData = {
        sender_id: requesterId,
        receiver_id: creator_id,
        conversation_id: conversation_id,
        linkup_id: linkupId,
      };

      // await createNewConversation(conversationData);

      await axios.post(
        `${MESSAGING_SERVICE_URL}/create-conversation`,
        conversationData
      );

      // Post Notification
      const notificationData = {
        creatorId: creator_id,
        requesterId: requesterId,
        type: "linkup_request",
        linkupId: linkupId,
        content: `New link-up request from ${requesterName}`,
      };

      // var notificationID = await createNotification(notificationData);
      await axios.post(
        `${NOTIFICATION_SERVICE_URL}/post-notification`,
        notificationData
      );

      if (notificationID) {
        try {
          // // Emit the user ID to store the socket connection
          // socket.emit("store-user-id", requesterId);

          // Emit the new linkup request event
          // notificationSocket.emit("new-linkup-request", notificationData);

          linkupRequestSocket
            .to(`user-${creator_id}`)
            .emit("new-linkup-request", notificationData);

          // Emit the "join-linkup-room" event to make the user join the room
          linkupSocket.emit("join-linkup-room", linkupId);

          console.log("EMIT JOIN LINKUP ROOM");

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
      message: "Failed to request link-up",
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
      };

      var notificationID = await createNotification(notificationData);

      if (notificationID) {
        // Emit request-accepted event to the requester of the linkup only
        linkupRequestSocket
          .to(`user-${linkupRequest.requester_id}`)
          .emit("request-accepted", notificationData);

        res.json({
          success: true,
          message: "Approved request successfully",
          linkupRequest: linkupRequest,
        });
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
  let queryPath = path.join(__dirname, "../db/queries/declineRequest.sql");

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
      };

      var notificationID = await createNotification(notificationData);

      if (notificationID) {
        // Emit request-accepted event to the requester of the linkup only
        linkupRequestSocket
          .to(`user-${linkupRequest.requester_id}`)
          .emit("request-declined", notificationData);
        res.json({
          success: true,
          message: "Decline request successfully",
          linkupRequest: linkupRequest,
        });
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

    if (rows.length > 0) {
      const linkupRequests = rows;
      res.json({
        success: true,
        message: "Linkup Requests fetched successfully",
        linkupRequestList: linkupRequests,
      });
    } else {
      res.json({
        success: true,
        message: "No linkup requests in the database",
        linkupRequestList: [],
      });
    }
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

    if (rows.length > 0) {
      const linkupRequests = rows;

      res.json({
        success: true,
        message: "Sent requests fetched successfully",
        linkupRequestList: linkupRequests,
      });
    } else {
      res.json({
        success: true,
        message: "No sent requests in the database",
        linkupRequestList: [],
      });
    }
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sent requests",
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

    if (rows.length > 0) {
      const linkupRequests = rows;
      res.json({
        success: true,
        message: "Received requests fetched successfully",
        linkupRequestList: linkupRequests,
      });
    } else {
      res.json({
        success: true,
        message: "No received requests in the database",
        linkupRequestList: [],
      });
    }
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sent requests",
      error: error.message,
    });
  }
};

const getRequestByLinkupidAndSenderid = async (req, res) => {
  const { linkupId, requesterId } = req.query;
  let queryPath = path.join(
    __dirname,
    "../db/queries/getRequestByLinkupidAndSenderid.sql"
  );

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [linkupId, requesterId];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "Link-up request fetched successfully",
        linkupRequestId: rows[0].id,
        linkupRequest: rows[0],
      });
    } else {
      res.json({
        success: false,
        message: "No link-up request for the given link-up id.",
        linkupRequestId: null,
        linkupRequest: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Linkup request fetch failed",
      linkupRequest: {},
    });
  }
};

module.exports = {
  initializeSocket,
  sendRequest,
  getLinkupRequests,
  getRequestByLinkupidAndSenderid,
  acceptRequest,
  declineRequest,
  getSentRequests,
  getReceivedRequests,
};
