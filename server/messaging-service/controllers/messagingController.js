require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const { getSocketByUserId } = require("../socket/messagingSocket");

const getConversations = async (req, res) => {
  const queryPath = path.join(__dirname, "../db/queries/getConversations.sql");
  const { userId } = req.params;
  try {
    // Read the SQL query from the file
    const query = fs.readFileSync(queryPath, "utf8");

    // Execute the query to fetch conversations for the specified user_id
    const { rows } = await pool.query(query, [userId]);

    res.json({
      success: true,
      message: "Conversations retrieved successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

const getMessagesForConversation = async (req, res) => {
  const queryPath = path.join(
    __dirname,
    "../db/queries/getMessagesForConversation.sql"
  );
  const { conversationId, userId } = req.params; // Assuming you have parameters for conversationId and userId

  try {
    // Read the SQL query from the file
    const query = fs.readFileSync(queryPath, "utf8");

    const { rows } = await pool.query(query, [conversationId, userId]);

    // Extract the messages into a separate 'messages' array in the response
    const messages = rows.map((row) => ({
      message_id: row.message_id,
      conversation_id: row.conversation_id,
      content: row.content,
      is_read: row.is_read,
      is_system_message: row.is_system_message,
      sender_id: row.sender_id,
      timestamp: row.timestamp,
      attachments: row.attachments,
      sender_name: row.sender_name,
      sender_avatar: row.sender_avatar,
      receiver_id: row.receiver_id,
    }));

    // Get the participants, linkup_id, and messages in the response
    const participants = rows.map((row) => row.participant_id);
    const linkupId = rows.length > 0 ? rows[0].linkup_id : null;

    res.json({
      success: true,
      message: "Messages retrieved successfully",
      data: {
        participants,
        linkup_id: linkupId,
        messages,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

const sendMessage = async (data) => {
  const { sender_id, receiver_id, conversation_id, message_content } = data;

  try {
    // Insert the message into the messages table
    const insertQueryPath = path.join(
      __dirname,
      "../db/queries/sendMessage.sql"
    );
    const insertQuery = fs.readFileSync(insertQueryPath, "utf8");
    const insertQueryValues = [
      sender_id,
      receiver_id,
      message_content,
      conversation_id,
    ];

    const { rows: insertedRows } = await pool.query(
      insertQuery,
      insertQueryValues
    );

    // Retrieve sender details using a separate query
    const senderDetailsQueryPath = path.join(
      __dirname,
      "../db/queries/getSenderDetails.sql"
    );
    const senderDetailsQuery = fs.readFileSync(senderDetailsQueryPath, "utf8");
    const senderDetailsQueryValues = [sender_id];

    const { rows: senderDetailsRows } = await pool.query(
      senderDetailsQuery,
      senderDetailsQueryValues
    );

    // Merge message details and sender details into one object
    const messageData = {
      sender_id: insertedRows[0].sender_id,
      message_content: insertedRows[0].content,
      conversation_id: insertedRows[0].conversation_id,
      timestamp: insertedRows[0].timestamp,
      sender_name: senderDetailsRows[0].sender_name,
      sender_avatar: senderDetailsRows[0].sender_avatar,
    };

    // Emit a real-time event to notify the recipient
    const recipientSocket = getSocketByUserId(receiver_id);
    const senderSocket = getSocketByUserId(sender_id);

    if (recipientSocket && senderSocket) {
      senderSocket.emit("new-message", messageData);
      recipientSocket.emit("new-message", messageData);
    }
  } catch (error) {
    console.error("Message send error:", error);
  }
};

const createNewConversation = async (data) => {
  const { sender_id, receiver_id, message_content, linkup_id } = data;

  const queryPathConversation = path.join(
    __dirname,
    "../db/queries/createConversation.sql"
  );
  const queryConversation = fs.readFileSync(queryPathConversation, "utf8");
  const queryValuesConversation = [message_content, linkup_id];

  try {
    // Insert into conversations and get the conversation_id
    const { rows } = await pool.query(
      queryConversation,
      queryValuesConversation
    );
    const conversationId = rows[0].conversation_id;

    // Insert into participants for sender
    const queryPathParticipantsSender = path.join(
      __dirname,
      "../db/queries/insertParticipants.sql"
    );
    const queryParticipantsSender = fs.readFileSync(
      queryPathParticipantsSender,
      "utf8"
    );
    const queryValuesParticipantsSender = [conversationId, sender_id];

    await pool.query(queryParticipantsSender, queryValuesParticipantsSender);

    // Insert into participants for receiver
    const queryPathParticipantsReceiver = path.join(
      __dirname,
      "../db/queries/insertParticipants.sql"
    );
    const queryParticipantsReceiver = fs.readFileSync(
      queryPathParticipantsReceiver,
      "utf8"
    );
    const queryValuesParticipantsReceiver = [conversationId, receiver_id];

    await pool.query(
      queryParticipantsReceiver,
      queryValuesParticipantsReceiver
    );

    // Insert into messages
    const queryPathMessages = path.join(
      __dirname,
      "../db/queries/insertMessage.sql"
    ); // Create a separate SQL file for this
    const queryMessages = fs.readFileSync(queryPathMessages, "utf8");
    const queryValuesMessages = [
      conversationId,
      sender_id,
      receiver_id,
      message_content,
    ];

    await pool.query(queryMessages, queryValuesMessages);

    return rows[0];
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  createNewConversation,
  getConversations,
  getMessagesForConversation,
};
