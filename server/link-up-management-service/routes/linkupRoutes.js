const express = require("express");
const router = express.Router();
const linkupController = require("../controllers/linkupController");

router.get("/get-linkups", linkupController.getLinkups);
router.post("/update-linkup", linkupController.updateLinkup);
router.post("/mark-expired-linkups", linkupController.markLinkupsAsExpired);
router.post("/create-linkup", linkupController.createLinkup);
router.delete("/delete-linkup", linkupController.deleteLinkup);

module.exports = router;
