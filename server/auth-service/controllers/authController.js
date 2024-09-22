require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const axios = require("axios");

const APP_ID = process.env.SENDBIRD_APP_ID;
const API_TOKEN = process.env.SENDBIRD_API_TOKEN;

// Set user status to active in PostgreSQL
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
    console.error("Error in setUserStatusActive:", error);
    throw new Error("Internal server error");
  }
};

// Create a new user in PostgreSQL
const createUser = async (user, client) => {
  const { id, name, phoneNumber } = user;

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

// Store Sendbird access token in PostgreSQL
const storeSendbirdAccessToken = async (id, token, client) => {
  try {
    const queryPath = path.join(
      __dirname,
      "../db/queries/storeSendbirdAccessToken.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [id, token];

    const { rows, rowCount } = await client.query(query, values);

    if (rowCount > 0) {
      return {
        success: true,
        message: "Sendbird access token was stored successfully!",
      };
    } else {
      return {
        success: false,
        message: "Error while storing Sendbird access token.",
      };
    }
  } catch (error) {
    console.error("Error in storeSendbirdAccessToken:", error);
    throw new Error("Internal server error");
  }
};

// Create a new Sendbird user
const createSendbirdUser = async (user) => {
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
    console.error("Error creating Sendbird user:", error);
    throw error;
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { clerkUserId } = req.query;

  try {
    const queryPath = path.join(
      __dirname,
      "../db/queries/getUserByClerkId.sql"
    );
    const queryText = fs.readFileSync(queryPath, "utf8");
    const queryValues = [clerkUserId];

    const { rows, rowCount } = await pool.query(queryText, queryValues);

    if (rowCount > 0) {
      if (rows[0].status === "inactive") {
        await setUserStatusActive(rows[0].id);
      }
      res.status(200).json({
        success: true,
        user: rows[0],
        message: "Authentication successful",
      });
    } else {
      res.status(400).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user by Clerk ID
const getUserByClerkId = async (req, res) => {
  const { clerkUserId } = req.query;
  const queryPath = path.join(__dirname, "../db/queries/getUserByClerkId.sql");

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [clerkUserId];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const user = rows[0];

      res.json({ success: true, message: "User exists", user });
    } else {
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
  storeSendbirdAccessToken,
  loginUser,
  getUserByClerkId,
};
