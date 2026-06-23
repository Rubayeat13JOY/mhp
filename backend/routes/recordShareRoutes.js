const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  shareAccess,
  revokeAccess,
  getMyShares,
  getSharedWithMe
} = require("../controllers/recordShareController");

router.post("/share", verifyToken, shareAccess);
router.put("/revoke/:id", verifyToken, revokeAccess);
router.get("/my-shares", verifyToken, getMyShares);
router.get("/shared-with-me", verifyToken, getSharedWithMe);

module.exports = router;