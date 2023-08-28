require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
// const { getSocketByUserId } = require("../socket/linkupRequestSocket");

// let socketIo;

// // Function to initialize the Socket.IO instance
// const initializeSocket = (io) => {
//   socketIo = io;
// };

const sendMessage = async (req, res) => {
  // const { sender_id, recipient_id, message_content } = req.body;
  // const queryPath = path.join(__dirname, "../db/queries/sendMessage.sql");
  // const query = fs.readFileSync(queryPath, "utf8");
  // const queryValues = [sender_id, recipient_id, message_content];
  // try {
  //   const { rows } = await pool.query(query, queryValues);
  //   // Emit a real-time event to notify the recipient
  //   const creatorSocket = getSocketByUserId(recipient_id);
  //   if (creatorSocket) {
  //     creatorSocket.emit("message-sent", {});
  //   }
  //   res.json({
  //     success: true,
  //     message: "Message sent successfully",
  //     data: rows[0],
  //   });
  // } catch (error) {
  //   console.error("Message send error:", error);
  //   res.status(500).json({
  //     success: false,
  //     message: "Failed to send message",
  //     error: error.message,
  //   });
  // }
};

const createNewConversation = async (data) => {
  const { sender_id, recipient_id, message_content } = data;

  const queryPath = path.join(
    __dirname,
    "../db/queries/createConversation.sql"
  );
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [sender_id, recipient_id, message_content];

  try {
    const { rows } = await pool.query(query, queryValues);
    return rows[0];
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

//   try {

//     //  // Emit a real-time event to notify the recipient
//     //  const creatorSocket = getSocketByUserId(recipient_id);
//     //  if (creatorSocket) {
//     //    creatorSocket.emit("message-sent", {});
//     //  }

//     res.json({
//       success: true,
//       message: "Message sent successfully",
//       data: rows[0],
//     });
//   } catch (error) {
//     console.error("Message send error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send message",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  // initializeSocket,
  sendMessage,
  createNewConversation,
};
