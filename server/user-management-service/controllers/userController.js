const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

const getUser = async (req, res) => {
  const { phoneNumber } = req.query;

  const queryPath = path.join(
    __dirname,
    "../db/queries/getUserByPhoneNumber.sql"
  );

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [phoneNumber];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const user = rows[0];

      // User exists in the database
      res.json({ success: true, message: "User exists", user: user });
    } else {
      // User not found
      res.json({ success: false, message: "User not found", user: null });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

const updateUserBio = async (req, res) => {
  const userId = req.params.userId;
  const { bio } = req.body;

  try {
    // Use the SQL query from the previous response to update the user profile properties

    const queryPath = path.join(__dirname, "../db/queries/updateUserBio.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [bio, userId];
    const result = await pool.query(query, values);

    // Check if the user with the given userId exists and update the profile properties
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserAvatar = async (req, res) => {
  const userId = req.params.userId;
  const { avatar } = req.body;

  try {
    // Use the SQL query from the previous response to update the user profile properties

    const queryPath = path.join(
      __dirname,
      "../db/queries/updateUserAvatar.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [avatar, userId];
    const result = await pool.query(query, values);

    // Check if the user with the given userId exists and update the profile properties
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUser,
  updateUserBio,
  updateUserAvatar,
};
