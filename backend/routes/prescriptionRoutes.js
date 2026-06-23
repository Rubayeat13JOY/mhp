const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const {
  uploadPrescription,
  getPrescriptions,
  searchPrescriptions,
  deletePrescription
} = require("../controllers/prescriptionController");

router.post("/upload", verifyToken, upload.single("file"), uploadPrescription);
router.get("/", verifyToken, getPrescriptions);
router.get("/search", verifyToken, searchPrescriptions);
router.delete("/:id", verifyToken, deletePrescription);

module.exports = router;