const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

// Function to send notifications to users using Socket.io
const sendNotificationsUsingSocketIO = (io, users, linkupId) => {
  for (const userId of users) {
    // Emit a custom event to notify the user about the expired linkup
    io.to(userId).emit("linkupsExpired", linkupId);
  }
};

// Function to update expired linkups
const updateExpiredLinkups = async (io) => {
  const queryPath = path.join(
    __dirname,
    "../db/queries/updateExpiredLinkups.sql"
  );
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [];

  try {
    const result = await pool.query(query, queryValues);
    const { rowCount, rows } = result;

    if (rowCount > 0) {
      const expiredLinkups = rows;

      for (const expiredLinkup of expiredLinkups) {
        const { id, creator_id } = expiredLinkup;

        // Use the correct namespace
        io.of("/linkup-management")
          .to(`user-${creator_id}`)
          .emit("linkupExpired", {
            linkupId: id,
            message: "One of your linkups has expired!",
          });

        const requesters = await findRequestersForLinkup(id);

        for (const requester of requesters) {
          io.of("/linkup-management")
            .to(`user-${requester.requester_id}`)
            .emit("linkupExpired", {
              linkupId: id,
              message: "A requested linkup has expired!",
            });
        }
      }

      console.log("Expired linkups updated successfully");
    }
  } catch (error) {
    console.error("Error updating link-ups:", error);
  }
};

// Function to find requesters for a specific linkup
const findRequestersForLinkup = async (linkupId) => {
  const query =
    "SELECT requester_id FROM link_up_requests WHERE linkup_id = $1";
  const values = [linkupId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching requesters:", error);
    return [];
  }
};

module.exports = {
  updateExpiredLinkups,
};
