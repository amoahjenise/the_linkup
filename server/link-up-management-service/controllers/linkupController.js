require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

const createLinkup = async (req, res) => {
  const { linkup } = req.body;

  // Insert the linkup into the database
  const queryPath = path.join(__dirname, "../db/queries/createLinkup.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [
    linkup.creator_id,
    linkup.creator_name,
    linkup.location,
    linkup.activity,
    linkup.date,
    linkup.time,
    linkup.gender_preference,
  ];

  console.log(linkup);
  console.log(queryValues);

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const linkup = rows[0];
      // Return the created linkup data in the response
      res.json({
        success: true,
        message: "Linkup created successfully",
        linkup: linkup,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to create linkup" });
    }
  } catch (error) {
    console.error("Error creating linkup:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create linkup" });
  }
};

const getLinkups = async (req, res) => {
  const queryPath = path.join(__dirname, "../db/queries/getLinkups.sql");
  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const linkups = rows;
      // Return linkups
      res.json({
        success: true,
        message: "Linkups fetched successfully",
        linkups: linkups,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch linkups" });
    }
  } catch (error) {
    console.error("Error fetching linkups:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch linkups" });
  }
};

module.exports = {
  createLinkup,
  getLinkups,
};
