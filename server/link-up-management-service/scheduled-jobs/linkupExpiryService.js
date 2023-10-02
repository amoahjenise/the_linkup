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

      // Iterate through expiredLinkups and emit notifications to creators and requesters
      for (const expiredLinkup of expiredLinkups) {
        const { id, creator_id } = expiredLinkup;

        console.log("Event: linkupsExpired, creator_id: ", creator_id);

        // Emit a real-time event to notify the creator of the expired link-up
        io.to(`user-${creator_id}`).emit("linkupExpired", { linkupId: id });

        // Find and emit notifications to requesters of the expired link-up
        const requesters = await findRequestersForLinkup(id);
        console.log("requesters: ", requesters);

        for (const requester of requesters) {
          io.to(`user-${requester.requester_id}`).emit("linkupExpired", {
            linkupId: id,
          });
        }

        // io.to(`linkup-${id}`).emit("linkupExpired", {
        //   linkup: expiredLinkup,
        // });
      }

      console.log("Expired linkups updated successfully");
    } else {
      console.log("No link-ups to update");
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
