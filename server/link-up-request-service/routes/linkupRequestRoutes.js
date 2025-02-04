const express = require("express");
const router = express.Router();
const linkupRequestController = require("../controllers/linkupRequestController");

router.post("/send-request", linkupRequestController.sendRequest);
router.get(
  "/get-linkup-requests/:userId",
  linkupRequestController.getLinkupRequests
);
router.get(
  "/get-sent-requests/:userId",
  linkupRequestController.getSentRequests
);
router.get(
  "/get-received-requests/:userId",
  linkupRequestController.getReceivedRequests
);
router.get(
  "/get-request-by-linkupid-and-senderid",
  linkupRequestController.getRequestByLinkupidAndSenderid
);
router.post(
  "/accept-request/:linkupRequestId",
  linkupRequestController.acceptRequest
);
router.post(
  "/decline-request/:linkupRequestId",
  linkupRequestController.declineRequest
);

module.exports = router;
