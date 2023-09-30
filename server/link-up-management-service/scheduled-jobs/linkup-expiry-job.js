const cron = require("node-cron");
const { updateExpiredLinkups } = require("./linkupExpiryService"); // Adjust the path as needed

// Define and export the function to schedule the linkup expiry job
exports.scheduleLinkupExpiryJob = (io) => {
  // Schedule the job to run every minute
  cron.schedule("* * * * *", () => {
    console.log("Running linkup expiry job...");
    updateExpiredLinkups(io); // Call the function to update expired linkups
  });
};
