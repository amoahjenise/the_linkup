const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const queryPath = path.join(__dirname, "../db/queries/deleteUser.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [userId];
    console.log("DELETED", userId);

    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  const { newUser } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(newUser.password.trim(), 10);

    // Insert the user into the database
    const queryPath = path.join(__dirname, "../db/queries/createUser.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const queryValues = [
      newUser.phoneNumber,
      hashedPassword,
      newUser.name,
      newUser.gender,
      newUser.dateOfBirth,
      newUser.avatarURL,
    ];

    const { rows, rowCount } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const user = rows[0];
      // Return the created user data in the response
      res.json({
        success: true,
        message: "User created successfully",
        user: user,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.query;
  const queryPath = path.join(__dirname, "../db/queries/getUserById.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [userId];

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
      res.json({
        success: true,
        message: "User bio updated",
        data: result.rows[0],
      });
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
      res.json({
        success: true,
        message: "User avatar updated",
        data: result.rows[0],
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const setUserStatusActive = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Use the SQL query from the previous response to update the user profile properties

    const queryPath = path.join(
      __dirname,
      "../db/queries/setUserStatusActive.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [userId];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const data = rows[0];
      res.json({
        success: true,
        message: "User status set to 'active'",
        data: data,
      });
    } else {
      res.json({
        success: false,
        message: "User status not updated to 'active'",
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  deleteUser,
  getUserById,
  updateUserBio,
  updateUserAvatar,
  setUserStatusActive,
};
