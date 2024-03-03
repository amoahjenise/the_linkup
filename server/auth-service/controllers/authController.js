require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const { validationResult } = require("express-validator");

const setUserStatusActive = async (id) => {
  try {
    const queryPath = path.join(
      __dirname,
      "../db/queries/setUserStatusActive.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [id];

    console.log("id", id);

    const { rows, rowCount } = await pool.query(query, values);

    console.log("rows", rows);
    if (rowCount > 0) {
      return {
        success: true,
        message: "User is now active!",
      };
    } else {
      return {
        success: false,
        message: "Error while updating user's status. Please contact support.",
      };
    }
  } catch (error) {
    throw new Error("Internal server error");
  }
};

// Create a new user
const createUser = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, phoneNumber } = req;

  try {
    // Insert the new user into the database
    const queryPath = path.join(__dirname, "../db/queries/createUser.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const queryValues = [id, phoneNumber];

    const { rows, rowCount } = await pool.query(query, queryValues);

    if (rowCount > 0) {
      return rows[0];
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Internal server error");
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { clerkUserId } = req.query;

  try {
    // Check if the user with the provided phone number exists
    const queryPath = path.join(
      __dirname,
      "../db/queries/getUserByClerkId.sql"
    );

    const queryText = fs.readFileSync(queryPath, "utf8");
    const queryValues = [clerkUserId];

    const { rows, rowCount } = await pool.query(queryText, queryValues);

    if (rowCount > 0) {
      console.log("rows[0].status", rows[0].status);
      if (rows[0].status === "inactive") {
        setUserStatusActive(rows[0].id);
      }
      res.status(200).json({
        success: true,
        user: rows[0],
        message: "Authentication successful",
      });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserByClerkId = async (req, res) => {
  const { clerkUserId } = req.query;
  const queryPath = path.join(__dirname, "../db/queries/getUserByClerkId.sql");

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [clerkUserId];

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

module.exports = {
  createUser,
  loginUser,
  getUserByClerkId,
};
