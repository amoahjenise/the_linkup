const express = require("express");
const router = express.Router();
const linkupRequestController = require("../controllers/linkupRequestController");

router.post("/send-request", linkupRequestController.sendRequest);
router.get("/get-request", linkupRequestController.getRequest);

// router.post("/accept-request", linkupRequestController.acceptRequest);
// router.post("/decline-request", linkupRequestController.declineRequest);

module.exports = router;
