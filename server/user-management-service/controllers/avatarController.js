const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

const uploadAvatar = async (req, res) => {
  try {
    const { userId, imageUrl } = req.body;

    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an avatar image" });
    }

    const queryPath = path.join(
      __dirname,
      "../db/queries/updateUserAvatar.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [imageUrl, userId];
    const result = await pool.query(query, values);

    if (result.rows[0]) res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update avatar" });
  }
};

module.exports = {
  uploadAvatar,
};
