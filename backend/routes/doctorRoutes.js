const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const {
  getDoctorProfile,
  updateDoctorProfile,
  getMyPatients,
  getPatientPrescriptions,
  createPrescriptionForPatient,
  getPatientHistory,
  getPatientReports,
  getAllDoctors
} = require("../controllers/doctorController");

router.get("/profile", verifyToken, getDoctorProfile);
router.put("/profile", verifyToken, updateDoctorProfile);
router.get("/all", verifyToken, getAllDoctors);
router.get("/patients", verifyToken, getMyPatients);
router.get("/patients/:patientId/prescriptions", verifyToken, getPatientPrescriptions);
router.post("/patients/:patientId/prescriptions", verifyToken, upload.single("file"), createPrescriptionForPatient);
router.get("/patients/:patientId/history", verifyToken, getPatientHistory);
router.get("/patients/:patientId/reports", verifyToken, getPatientReports);

module.exports = router;