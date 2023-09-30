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
    const { rows, rowCount } = await pool.query(query, queryValues);
    if (rowCount > 0) {
      const linkupId = rows[0].id;

      // // On the server side, when a linkup is created:
      // // Emit a real-time event to notify the creator of the new linkup
      // const socketsMap = socketIo.sockets.sockets; // Access the 'sockets' property
      // const socketKey = Array.from(socketsMap.keys())[0]; // Get the first (and only) key in the Map
      // const creatorSocket = socketsMap.get(socketKey); // Get the value associated with the key

      // console.log("creatorSocket", socketKey);
      if (socketIo) {
        socketIo.emit("linkupCreated", { linkupId });

        // Create a room for the linkup (if not already created) and add the creator to it
        // const linkupRoom =
        //   socketIo.of("/linkup").adapter.rooms[`linkup-${linkupId}`];

        // if (!linkupRoom) {
        //   creatorSocket.join(`linkup-${linkupId}`);
        // }
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
    console.error("Error creating linkup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create linkup",
      error: error.message,
    });
  }
};

const getLinkups = async (req, res) => {
  const userId = req.params.userId;
  const gender = req.query.gender;

  const queryPath = path.join(__dirname, "../db/queries/getLinkups.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [userId, gender];

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

const getUserLinkups = async (req, res) => {
  const userId = req.params.userId;
  const queryPath = path.join(
    __dirname,
    "../db/queries/getLinkupsByUserId.sql"
  );
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [userId];

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

closeLinkup = async (req, res) => {
  const { linkupId } = req.params;

  const queryPath = path.join(__dirname, "../db/queries/closeLinkup.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [linkupId];

  try {
    const { rows } = await pool.query(query, queryValues);
    if (rows.length > 0) {
      // Emit a real-time event to notify clients about the completed link-up
      const completedLinkup = rows;
      //  socketIo.emit("linkupCompleted", completedLinkup);

      res.json({
        success: true,
        message: "Link-up completed successfully",
        linkupList: rows,
      });
    }
  } catch (error) {
    console.error("Error completing the link-up:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete the link-up",
      error: error.message,
    });
  }
};

module.exports = {
  initializeSocket,
  createLinkup,
  getLinkups,
  getUserLinkups,
  deleteLinkup,
  updateLinkup,
  closeLinkup,
};
