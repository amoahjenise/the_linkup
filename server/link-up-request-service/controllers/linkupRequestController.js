require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const io = require("socket.io-client");
const NOTIFICATION_SERVICE_URL = "http://localhost:3005";

const socket = io(NOTIFICATION_SERVICE_URL); // Initialize socket connection to notification service

const {
  createNotification,
} = require("../../notification-service/controllers/notificationController");

const sendRequest = async (req, res) => {
  const { requesterId, requesterName, creator_id, linkupId, content } =
    req.body;
  const queryPath = path.join(__dirname, "../db/queries/sendRequest.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [requesterId, creator_id, linkupId, content];

  try {
    // Post Linkup Request
    var { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      // Post Notification
      const notificationData = {
        creatorId: creator_id,
        requesterName: requesterName,
        requesterId: requesterId,
        type: "linkup_request",
        linkupId: linkupId,
        content: `New linkup request from ${requesterName}`,
      };

      console.log("ROES:", notificationID);

      var notificationID = await createNotification(notificationData);

      if (notificationID) {
        try {
          // Emit the user ID to store the socket connection
          socket.emit("store-user-id", requesterId);

          // Emit the new linkup request event
          socket.emit("new-linkup-request", notificationData);

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
    console.log(rows);
    if (rows.length > 0) {
      const linkupRequest = rows[0];
      res.json({
        success: true,
        message: "Approved request successfully",
        linkupRequest: linkupRequest,
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
  const { linkupRequestId } = req.params;
  let queryPath = path.join(__dirname, "../db/queries/declineRequest.sql");

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [linkupRequestId];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const linkupRequest = rows[0];
      res.json({
        success: true,
        message: "Decline request successfully",
        linkupRequest: linkupRequest,
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

    console.log(rows);

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "Linkup request fetched successfully",
        linkupRequestId: rows[0].id,
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
  sendRequest,
  getLinkupRequests,
  getRequestByLinkupidAndSenderid,
  acceptRequest,
  declineRequest,
};
