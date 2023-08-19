require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

let socketIo;

// Function to initialize the Socket.IO instance
const initializeSocket = (io) => {
  socketIo = io;
};

const createLinkup = async (req, res) => {
  const { linkup } = req.body;

  const queryPath = path.join(__dirname, "../db/queries/createLinkup.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [
    linkup.creator_id,
    linkup.creator_name,
    linkup.location,
    linkup.activity,
    linkup.date,
    linkup.gender_preference,
  ];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const linkup = rows[0];

      // Emit a real-time event to notify clients about the new linkup
      socketIo.emit("createLinkup", linkup);

      res.json({
        success: true,
        message: "Linkup created successfully",
        newLinkup: linkup,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create linkup",
        newLinkup: null,
      });
    }
  } catch (error) {
    console.error("Error creating linkup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create linkup",
      error: error.message,
    });
  }
};

const getLinkups = async (req, res) => {
  const userId = req.query.userId;
  let queryPath = path.join(__dirname, "../db/queries/getLinkups.sql");

  if (userId) {
    queryPath = path.join(__dirname, "../db/queries/getLinkupsByUserId.sql");
  }

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = userId ? [userId] : [];

  try {
    const { rows } = await pool.query(query, queryValues);

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
    console.error("Error fetching linkups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch linkups",
      error: error.message,
    });
  }
};

const deleteLinkup = async (req, res) => {
  const { id } = req.query;

  const queryPath = path.join(__dirname, "../db/queries/deleteLinkup.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [id];

  try {
    const response = await pool.query(query, queryValues);

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
    console.error("Error deleting linkup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete linkup",
      error: error.message,
    });
  }
};

const updateLinkup = async (req, res) => {
  const { id } = req.query;
  const { linkup } = req.body;
  const queryPath = path.join(__dirname, "../db/queries/updateLinkup.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [
    linkup.location,
    linkup.activity,
    linkup.date,
    linkup.gender_preference,
    id,
  ];

  try {
    const { rows } = await pool.query(query, queryValues);

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
    console.error("Error updating linkup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create linkup",
      error: error.message,
    });
  }
};

const markLinkupsAsExpired = async (req, res) => {
  const queryPath = path.join(
    __dirname,
    "../db/queries/markLinkupsAsExpired.sql"
  );
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [];

  try {
    const { rows } = await pool.query(query, queryValues);
    console.log("Expired Link-Ups:", rows);
    if (rows.length > 0) {
      // Emit a real-time event to notify clients about expired link-ups
      const expiredLinkups = rows;
      socketIo.emit("linkupsExpired", expiredLinkups);

      res.json({
        success: true,
        message: "Link-ups updated successfully",
        linkupList: rows,
      });
    } else {
      res.json({
        success: true,
        message: "No link-ups to update",
        linkupList: [],
      });
    }
  } catch (error) {
    console.error("Error updating link-ups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update link-ups",
      error: error.message,
    });
  }
};

module.exports = {
  initializeSocket,
  createLinkup,
  getLinkups,
  deleteLinkup,
  updateLinkup,
  markLinkupsAsExpired,
};
