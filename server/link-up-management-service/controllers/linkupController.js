require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

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

let socketIo;

// Function to initialize the Socket.IO instance
const initializeSocket = (io) => {
  socketIo = io;
};

const searchLinkups = async (req, res) => {
  const { search_term, gender } = req.query;
  const { userId } = req.params;
  const queryPath = path.join(__dirname, "../db/queries/searchLinkups.sql");
  const query = readQueryFile(queryPath);

  try {
    const { rows } = await pool.query(query, [
      `%${search_term}%`,
      gender,
      userId,
    ]);

    res.json({
      success: true,
      message:
        rows.length > 0
          ? "Linkups fetched successfully"
          : "No linkups found matching the search term",
      linkupList: rows,
    });
  } catch (error) {
    handleDatabaseError(res, error, "Error searching linkups:");
  }
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
    linkup.payment_option,
  ];

  try {
    const { rows, rowCount } = await pool.query(query, linkupQueryValues);
    if (rowCount > 0) {
      const newLinkup = rows[0];

      // Emit the event to all connected users
      if (socketIo) {
        socketIo.emit("linkupCreated", { id: newLinkup.id, linkup: newLinkup });
      }

      res.json({
        success: true,
        message: "Linkup created successfully",
        newLinkup,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create link-up",
        newLinkup: null,
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error creating linkup:");
  }
};

const getLinkups = async (req, res) => {
  const { userId } = req.params;
  const { gender, offset, pageSize, latitude, longitude } = req.query;
  const queryPath = path.join(__dirname, "../db/queries/getLinkups.sql");
  const query = readQueryFile(queryPath);
  const linkupsQueryValues = [
    userId,
    gender,
    offset,
    pageSize,
    latitude,
    longitude,
  ];

  try {
    const { rows } = await pool.query(query, linkupsQueryValues);

    res.json({
      success: true,
      message:
        rows.length > 0
          ? "Linkups fetched successfully"
          : "No linkups in the database",
      linkupList: rows,
    });
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

    res.json({
      success: true,
      message:
        rows.length > 0
          ? "Linkups fetched successfully"
          : "No linkups in the database",
      linkupList: rows,
    });
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
    } else {
      res.status(404).json({
        success: false,
        message: "Linkup status not found",
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
    const { rowCount } = await pool.query(query, deleteLinkupQueryValues);

    if (rowCount > 0) {
      // Emit the event to all connected users
      if (socketIo) {
        socketIo.emit("linkupDeleted", { id: linkupId.id, linkup: linkupId });
      }

      res.json({
        success: true,
        message: "Linkup deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Linkup not found",
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
      res.json({
        success: true,
        message: "Linkup updated successfully",
        linkup: rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Linkup not found",
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

    if (rows.length > 0) {
      const linkup = rows[0];

      if (socketIo) {
        socketIo.emit("linkupClosed", { linkup });
      }

      res.json({
        success: true,
        message: "Linkup closed successfully",
        linkup,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Linkup not found",
        linkup: null,
      });
    }
  } catch (error) {
    handleDatabaseError(res, error, "Error closing linkup:");
  }
};

module.exports = {
  initializeSocket,
  searchLinkups,
  createLinkup,
  getLinkups,
  getUserLinkups,
  getLinkupStatus,
  deleteLinkup,
  updateLinkup,
  closeLinkup,
};
