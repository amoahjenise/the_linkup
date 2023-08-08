const express = require("express");
const router = express.Router();
const linkupController = require("../controllers/linkupController");

router.get("/get-linkups", linkupController.getLinkups);
router.post("/create-linkup", linkupController.createLinkup);

module.exports = router;
