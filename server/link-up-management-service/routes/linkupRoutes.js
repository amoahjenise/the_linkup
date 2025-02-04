const express = require("express");
const router = express.Router();
const linkupController = require("../controllers/linkupController");

router.get("/linkups/:userId", linkupController.getLinkups);
router.get("/linkups/user/:userId", linkupController.getUserLinkups);
router.post("/linkups/update/:linkupId", linkupController.updateLinkup);
router.post("/linkups/close/:linkupId", linkupController.closeLinkup);
router.post("/linkups/create", linkupController.createLinkup);
router.delete("/linkups/:linkupId", linkupController.deleteLinkup);
router.get("/linkups/status/:linkupId", linkupController.getLinkupStatus);
router.get("/linkups/search/:userId", linkupController.searchLinkups);

module.exports = router;
