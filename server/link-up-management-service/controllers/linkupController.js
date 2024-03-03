require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

let socketIo;

// Function to initialize the Socket.IO instance
const initializeSocket = (io) => {
  socketIo = io;
};

const readQueryFile = (queryPath) => {
  return fs.readFileSync(queryPath, "utf8");
};

const handleDatabaseError = (res, error, errorMessage) => {
  console.error(errorMessage, error);
  res.status(500).json({
    success: false,
    message: errorMessage,
    error: error.message,
  });
};

const createLinkup = async (req, res) => {
  const { linkup } = req.body;
  const queryPath = path.join(__dirname, "../db/queries/createLinkup.sql");
  const query = readQueryFile(queryPath);
  const linkupQueryValues = [
    linkup.creator_id,
    linkup.creator_name,
    linkup.location,
    linkup.activity,
    linkup.date,
    linkup.gender_preference,
    linkup.payment_option
  ];

  try {
    const { rows, rowCount } = await pool.query(query, linkupQueryValues);
    if (rowCount > 0) {
      const newLinkup = rows[0];
      const socketsMap = socketIo.sockets.sockets;
      const socketKey = Array.from(socketsMap.keys())[0];
      const socket = socketsMap.get(socketKey);

      if (socket && socketIo) {
        socketIo
          .to(`user-${newLinkup.creator_id}`)
          .emit("linkupCreated", { id: newLinkup.id });
        const linkupRoomName = `linkup-${newLinkup.id}`;
        socket.join(linkupRoomName);
      }

      res.json({
        success: true,
        message: "Linkup created successfully",
        newLinkup: rows[0],
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create linkup",
        newLinkup: null,
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error creating linkup:");
  }
};

const getLinkups = async (req, res) => {
  const { userId } = req.params;
  const { gender, offset, pageSize } = req.query;
  const queryPath = path.join(__dirname, "../db/queries/getLinkups.sql");
  const query = readQueryFile(queryPath);
  const linkupsQueryValues = [userId, gender, offset, pageSize];

  try {
    // Modify your SQL query to handle pagination
    const { rows } = await pool.query(query, linkupsQueryValues);

    if (rows.length > 0) {
      const linkups = rows;
      res.json({
        success: true,
        message: "Linkups fetched successfully",
        linkupList: linkups,
      });
    } else {
      res.json({
        success: true,
        message: "No linkups in the database",
        linkupList: [],
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error fetching linkups:");
  }
};

const getUserLinkups = async (req, res) => {
  const { userId } = req.params;
  const queryPath = path.join(
    __dirname,
    "../db/queries/getLinkupsByUserId.sql"
  );
  const query = readQueryFile(queryPath);
  const userLinkupsQueryValues = [userId];

  try {
    const { rows } = await pool.query(query, userLinkupsQueryValues);

    if (rows.length > 0) {
      const linkups = rows;
      res.json({
        success: true,
        message: "Linkups fetched successfully",
        linkupList: linkups,
      });
    } else {
      res.json({
        success: true,
        message: "No linkups in the database",
        linkupList: [],
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error fetching linkups:");
  }
};

const getLinkupStatus = async (req, res) => {
  const { linkupId } = req.params;
  const queryPath = path.join(__dirname, "../db/queries/getLinkupStatus.sql");
  const query = readQueryFile(queryPath);
  const linkupStatusQueryValues = [linkupId];

  try {
    const { rows } = await pool.query(query, linkupStatusQueryValues);

    if (rows.length > 0) {
      const status = rows[0].status;
      res.json({
        success: true,
        message: "Linkup status fetched successfully",
        linkupStatus: status,
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error fetching linkup status:");
  }
};

const deleteLinkup = async (req, res) => {
  const { linkupId } = req.params;
  const queryPath = path.join(__dirname, "../db/queries/deleteLinkup.sql");
  const query = readQueryFile(queryPath);
  const deleteLinkupQueryValues = [linkupId];

  try {
    const response = await pool.query(query, deleteLinkupQueryValues);

    if (response.rowCount > 0) {
      res.json({
        success: true,
        message: "Linkup deleted successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to delete linkup",
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error deleting linkup:");
  }
};

const updateLinkup = async (req, res) => {
  const { linkupId } = req.params;
  const { linkup } = req.body;
  const queryPath = path.join(__dirname, "../db/queries/updateLinkup.sql");
  const query = readQueryFile(queryPath);
  const updateLinkupQueryValues = [
    linkup.location,
    linkup.activity,
    linkup.date,
    linkup.gender_preference,
    linkup.payment_option,
    linkupId,
  ];

  try {
    const { rows } = await pool.query(query, updateLinkupQueryValues);

    if (rows.length > 0) {
      const linkup = rows[0];
      res.json({
        success: true,
        message: "Linkup updated successfully",
        linkup: linkup,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to update linkup",
        linkup: null,
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error updating linkup:");
  }
};

const closeLinkup = async (req, res) => {
  const { linkupId } = req.params;
  const queryPath = path.join(__dirname, "../db/queries/closeLinkup.sql");
  const query = readQueryFile(queryPath);
  const closeLinkupQueryValues = [linkupId];

  try {
    const { rows } = await pool.query(query, closeLinkupQueryValues);
    console.log("closeLinkup: ", rows);

    if (rows.length > 0) {
      const closedLinkup = rows;

      res.json({
        success: true,
        message: "Link-up closed.",
        linkupList: rows[0],
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error closing the link-up:");
  }
};

module.exports = {
  initializeSocket,
  createLinkup,
  getLinkups,
  getLinkupStatus,
  getUserLinkups,
  deleteLinkup,
  updateLinkup,
  closeLinkup,
};
