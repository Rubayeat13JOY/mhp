const { Prescription, Patient, User } = require("../models");
const Tesseract = require("tesseract.js");
const path = require("path");

// Upload Prescription
exports.uploadPrescription = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const fileURL = req.file ? `/uploads/${req.file.filename}` : null;
    let extractedText = null;

    // OCR - image theke text extract
    if (req.file && [".jpg", ".jpeg", ".png"].includes(path.extname(req.file.originalname).toLowerCase())) {
      const result = await Tesseract.recognize(req.file.path, "eng");
      extractedText = result.data.text;
    }

    const prescription = await Prescription.create({
      PatientID: patient.PatientID,
      FileURL: fileURL,
      ExtractedText: extractedText,
      Notes: req.body.notes || null,
      MedicineName: req.body.medicineName || null,
      Dosage: req.body.dosage || null,
      UploadedBy: "patient"
    });

    res.status(201).json({
      success: true,
      message: "Prescription uploaded successfully",
      prescription
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const prescriptions = await Prescription.findAll({
      where: { PatientID: patient.PatientID }
    });

    res.status(200).json({ success: true, prescriptions });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Prescription
exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    await prescription.destroy();

    res.status(200).json({ success: true, message: "Prescription deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};