require("dotenv").config({ path: "./server/image-service/.env" });
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

// Environment variables
const CLIENT_ID = process.env.INSTAGRAM_APP_ID;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

// Helper function to handle errors
const handleError = (error) => {
  console.error("Error:", error.response ? error.response.data : error.message);
  throw error;
};

// Exchange authorization code for access token
const getAccessToken = async (code) => {
  try {
    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
    console.log("access_token", access_token);
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getUserMedia = async (accessToken) => {
  try {
    console.log("getUserMedia call", accessToken);
    // Note that the fetch API returns a Response object that represents the entire HTTP response.
    // To access the actual data (the response body), you need to parse the response as JSON using the .json() method.
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram media");
    }

    // Parse the response body as JSON
    const data = await response.json();

    console.log("media", data);

    return {
      success: true,
      message: "Instagram media fetched successfully!",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching Instagram media:", error);

    return {
      success: false,
      message: "Could not fetch Instagram media.",
      error: error.message,
    };
  }
};

const getInstagramAccessToken = async (req, res) => {
  const userId = req.params.userId;

  try {
    const queryPath = path.join(
      __dirname,
      "../db/queries/getInstagramAccessToken.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [userId];

    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount > 0) {
      res.json({
        success: true,
        message: "Instagram access token fetched successfully!",
        instagram_access_token: rows[0].instagram_access_token,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Could not fetch Instagram access token.",
        instagram_access_token: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const postInstagramAccessToken = async (req, res) => {
  const userId = req.params.userId;
  const { access_token } = req.body;

  try {
    const queryPath = path.join(
      __dirname,
      "../db/queries/postInstagramAccessToken.sql"
    );
    const query = fs.readFileSync(queryPath, "utf8");
    const values = [userId, access_token];

    console.log("postInstagramAccessToken", values);
    const { rows, rowCount } = await pool.query(query, values);
    console.log("postInstagramAccessToken rows", rows);

    if (rowCount > 0) {
      res.json({
        success: true,
        message: "Instagram access token updated successfully!",
        token: rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Could not update Instagram access token.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Export functions for use in the router
module.exports = {
  getAccessToken,
  getUserMedia,
  getInstagramAccessToken,
  postInstagramAccessToken,
};
