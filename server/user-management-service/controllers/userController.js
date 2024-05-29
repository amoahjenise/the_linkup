const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const deactivateUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const queryPath = path.join(__dirname, "../db/queries/deactivateUser.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [userId];

    const { rowCount } = await pool.query(query, values);

    if (rowCount > 0) {
      res.json({
        success: true,
        message: "User deactivated successfully!",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to deactivate user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (id) => {
  try {
    const queryPath = path.join(__dirname, "../db/queries/deleteUser.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [id];

    console.log("id", id);

    const { rows, rowCount } = await pool.query(query, values);

    console.log("rows", rows);
    if (rowCount > 0) {
      return {
        success: true,
        message: "User deleted successfully!",
      };
    } else {
      return {
        success: false,
        message: "User not found. Please contact support.",
      };
    }
  } catch (error) {
    throw new Error("Internal server error");
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
      res
        .status(404)
        .json({ success: false, message: "User not found", user: null });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

// Update an existing user
const updateUser = async (req, res) => {
  const { user } = req.body;

  try {
    // Construct the SQL query
    const queryPath = path.join(__dirname, "../db/queries/updateUser.sql");
    const query = fs.readFileSync(queryPath, "utf8");

    // Execute the SQL query to update the user
    const queryValues = [
      user.clerkUserId,
      user.gender,
      user.dateOfBirth,
      user.avatarURL,
    ];

    const { rows, rowCount } = await pool.query(query, queryValues);

    // Check if the user was successfully updated
    if (rowCount > 0) {
      // Retrieve the updated user data from the database if needed
      // Assuming your SQL query returns the updated user data, you can access it from 'rows'
      // const updatedUser = rows[0];

      return res.status(200).json({
        success: true,
        message: "Updated user successfully",
        user: rows[0],
      });
    } else {
      // If rowCount is 0, it means no user was updated (probably no user with the provided clerkUserId exists)
      return res.status(404).json({
        success: false,
        message: "User not found or not updated",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
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
  deactivateUser,
  deleteUser,
  getUserById,
  updateUser,
  updateUserBio,
  updateUserAvatar,
  setUserStatusActive,
};
