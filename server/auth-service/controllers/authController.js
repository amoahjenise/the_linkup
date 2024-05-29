require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const axios = require("axios");

const APP_ID = process.env.SENDBIRD_APP_ID;
const API_TOKEN = process.env.SENDBIRD_API_TOKEN;

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

// Create a new user in the posgresql db
const createUser = async (user, client) => {
  const { id, name, phoneNumber } = user; // Use req.body to access data

  try {
    const queryPath = path.join(__dirname, "../db/queries/createUser.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const queryValues = [id, name, phoneNumber];

    const { rows, rowCount } = await client.query(query, queryValues);
    console.log("rows", rows);

    if (rowCount > 0) {
      return rows[0];
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Internal server error");
  }
};

// Create a new Sendbird user
const createSendbirdUser = async (user, client) => {
  console.log("user", user);

  const { id, name } = user;

  try {
    const response = await axios.post(
      `https://api-${APP_ID}.sendbird.com/v3/users`,
      {
        user_id: id,
        nickname: name,
        profile_url: "",
        issue_access_token: true,
      },
      {
        headers: {
          "Api-Token": API_TOKEN,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
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
  createSendbirdUser,
  loginUser,
  getUserByClerkId,
};
