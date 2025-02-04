const { pool } = require("../db");
const fs = require("fs");
const path = require("path");

const postLocation = async (req, res) => {
  const { id, city, country, latitude, longitude, allow_location } = req.body;
  const queryPath = path.join(__dirname, "../db/queries/postLocation.sql");
  const query = fs.readFileSync(queryPath, "utf8");

  try {
    console.log(
      `${id} ${city} ${country} ${latitude} ${longitude} ${allow_location}`
    );

    const { rows, rowCount } = await pool.query(query, [
      id,
      city,
      country,
      latitude,
      longitude,
      allow_location,
    ]);
    if (rowCount > 0) {
      res.json({
        success: true,
        message: "Location posted successfully",
        user: rows[0],
      });
    } else {
      res.json({
        success: true,
        message: "Error during location posting.",
        user: [],
      });
    }
  } catch (error) {
    console.error("Error posting location", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  postLocation,
};
