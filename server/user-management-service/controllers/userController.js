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

    const { rowCount } = await pool.query(query, values);
    if (rowCount > 0) {
      res.json({
        success: true,
        message: "User deleted successfully!",
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

    if (rowCount > 0) {
      // Return the created user data in the response
      res.json({
        success: true,
        message: "New user created successfully!",
        user: rows[0],
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
    const { rows, rowCount } = await pool.query(query, queryValues);

    if (rowCount > 0) {
      // User exists in the database
      res.json({ success: true, message: "User exists", user: rows[0] });
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
    const queryPath = path.join(__dirname, "../db/queries/updateUserBio.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [userId, bio];

    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount > 0) {
      res.json({
        success: true,
        message: "Bio updated successfully!",
        bio: rows[0].bio,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Could not update user's bio.",
        bio: null,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUserAvatar = async (req, res) => {
  const userId = req.params.userId;
  const { avatar } = req.body;

  try {
    const queryPath = path.join(
      __dirname,
      "../db/queries/updateUserAvatar.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [avatar, userId];

    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount > 0) {
      res.json({
        success: true,
        message: "Avatar updated successfully!",
        avatar: rows[0].avatar,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Could not update user's avatar.",
        avatar: null,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const setUserStatusActive = async (req, res) => {
  const userId = req.params.userId;

  try {
    const queryPath = path.join(
      __dirname,
      "../db/queries/setUserStatusActive.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [userId];

    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount > 0) {
      res.json({
        success: true,
        message: "User status set to 'active'.",
        userId: rows[0].id,
      });
    } else {
      res.json({
        success: false,
        message: "User status could not be updated to 'active'.",
        userId: null,
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
