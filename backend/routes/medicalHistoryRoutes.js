const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const {
  addHistory,
  getHistory,
  deleteHistory
} = require("../controllers/medicalHistoryController");

router.post("/", verifyToken, upload.single("file"), addHistory);
router.get("/", verifyToken, getHistory);
router.delete("/:id", verifyToken, deleteHistory);

module.exports = router;