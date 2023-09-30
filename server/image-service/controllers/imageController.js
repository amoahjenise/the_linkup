const { pool } = require("../db");
const fs = require("fs");
const path = require("path");

const getImages = async (req, res) => {
  const { userId } = req.query;

  const queryPath = path.join(__dirname, "../db/queries/getImages.sql");
  const query = fs.readFileSync(queryPath, "utf8");

  try {
    const { rows, rowCount } = await pool.query(query, [userId]);
    if (rowCount > 0) {
      res.json({
        success: true,
        message: "Images fetched successfully",
        images: rows,
      });
    } else {
      res.json({
        success: true,
        message: "Usser has no images.",
        images: [],
      });
    }
  } catch (error) {
    console.error("Error fetching images", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadImages = async (req, res) => {
  const { userId, imageUrls } = req.body.params; // Access userId and imageUrls from req.body.params

  const queryPath = path.join(__dirname, "../db/queries/uploadImages.sql");

  const query = fs.readFileSync(queryPath, "utf8");

  try {
    const uploadedImages = [];

    for (const imageUrl of imageUrls) {
      const values = [userId, imageUrl];
      const { rows } = await pool.query(query, values);

      if (rows[0] && rows[0].id) {
        uploadedImages.push(rows[0].image_url);
      }
    }
    res.status(200).json({
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error uploading images", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteImages = async (req, res) => {
  const { userId } = req.body.params;

  const queryPath = path.join(__dirname, "../db/queries/deleteImages.sql");

  const query = fs.readFileSync(queryPath, "utf8");

  try {
    // Use a transaction for consistency
    await pool.query("BEGIN");

    // Delete images based on user_id and image_url
    await pool.query(query, [userId]);

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({ message: "Images deleted successfully" });
  } catch (error) {
    // Rollback the transaction in case of an error
    await pool.query("ROLLBACK");

    console.error("Error deleting images", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getImages,
  uploadImages,
  deleteImages,
};
