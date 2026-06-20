const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const {
  uploadPrescription,
  getPrescriptions,
  deletePrescription
} = require("../controllers/prescriptionController");

router.post("/upload", verifyToken, upload.single("file"), uploadPrescription);
router.get("/", verifyToken, getPrescriptions);
router.delete("/:id", verifyToken, deletePrescription);

module.exports = router;