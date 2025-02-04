const express = require("express");
const router = express.Router();
const {
  getAccessToken,
  getUserMedia,
  getInstagramAccessToken,
  postInstagramAccessToken,
} = require("../controllers/imageController");

// Route to handle Instagram OAuth redirect
router.get("/auth/instagram", (req, res) => {
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(instagramAuthUrl);
});

// Route to handle exchange of code for access token
router.get("/auth/instagram/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const accessToken = await getAccessToken(code);
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch user media
router.get("/user/media", async (req, res) => {
  const { accessToken } = req.query;
  try {
    const media = await getUserMedia(accessToken);
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch Instagram access token from the database
router.get("/user/:userId/instagram-token", getInstagramAccessToken);

// Route to post Instagram access token to the database
router.post("/user/:userId/instagram-token", postInstagramAccessToken);

module.exports = router;
