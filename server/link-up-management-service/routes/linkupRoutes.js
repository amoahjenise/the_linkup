const express = require("express");
const router = express.Router();
const linkupController = require("../controllers/linkupController");

router.get("/get-linkups/:userId", linkupController.getLinkups);
router.get("/get-user-linkups/:userId", linkupController.getUserLinkups);
router.post("/update-linkup", linkupController.updateLinkup);
router.post("/close-linkup/:linkupId", linkupController.closeLinkup);
router.post("/create-linkup", linkupController.createLinkup);
router.delete("/delete-linkup", linkupController.deleteLinkup);

module.exports = router;
