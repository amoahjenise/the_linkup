require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

let messagingSocket;

// Function to initialize the Socket.IO instance
const initializeSocket = (io) => {
  messagingSocket = io;
};

const createNewConversation = async (req, res) => {
  const { sender_id, receiver_id, conversation_id, linkup_id } = req.body;

  const queryPathConversation = path.join(
    __dirname,
    "../db/queries/createConversation.sql"
  );

  const queryConversation = fs.readFileSync(queryPathConversation, "utf8");
  const queryValuesConversation = [
    conversation_id,
    linkup_id,
    receiver_id,
    sender_id,
  ];

  try {
    // Insert into conversations and get the conversation_id
    const { rows } = await pool.query(
      queryConversation,
      queryValuesConversation
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "New conversation saved successfully",
        conversation: rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "New conversation failed to save.",
      });
    }
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

const getConversationByChannelUrl = async (channelUrl) => {
  const queryPath = path.join(
    __dirname,
    "../db/queries/getConversationByChannelUrl.sql"
  );

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [channelUrl];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "New conversation saved successfully",
        channel: rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "New conversation failed to save.",
      });
    }
  } catch (error) {
    console.error("Error fetching conversation by channel URL:", error);
    throw error;
  }
};
const getLinkupByConversation = async (req, res) => {
  try {
    const { channelUrl } = req.params;
    const queryPath = path.join(
      __dirname,
      "../db/queries/getLinkupByConversationId.sql"
    );

    const query = fs.readFileSync(queryPath, "utf8");
    const queryValues = [channelUrl];

    // Execute the SQL query using your database connection pool
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "Linkup by conversation fetched successfully",
        linkup: rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Linkup by conversation not found",
      });
    }
  } catch (error) {
    console.error("Error fetching linkup by conversation:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching linkup by conversation",
      error: error.message,
    });
  }
};

module.exports = {
  initializeSocket,
  createNewConversation,
  getConversationByChannelUrl,
  getLinkupByConversation,
};
