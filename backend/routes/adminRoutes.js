const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const {
  getUserStats,
  getSystemAnalytics,
  getAllUsers,
  deleteUser
} = require("../controllers/adminController");
const { getAllLogs, getFailedLogins } = require("../controllers/activityLogController");

router.get("/stats", verifyToken, verifyAdmin, getUserStats);
router.get("/analytics", verifyToken, verifyAdmin, getSystemAnalytics);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);
router.get("/activity-logs", verifyToken, verifyAdmin, getAllLogs);
router.get("/security/failed-logins", verifyToken, verifyAdmin, getFailedLogins);

module.exports = router;