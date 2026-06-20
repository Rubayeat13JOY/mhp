const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const {
  uploadReport,
  getReports,
  deleteReport
} = require("../controllers/reportController");

router.post("/upload", verifyToken, upload.single("file"), uploadReport);
router.get("/", verifyToken, getReports);
router.delete("/:id", verifyToken, deleteReport);

module.exports = router;