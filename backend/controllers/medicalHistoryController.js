const { MedicalHistory, Patient, User } = require("../models");
const Tesseract = require("tesseract.js");
const path = require("path");
const { Op } = require("sequelize");

// Add Medical History
exports.addHistory = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const fileURL = req.file ? `/uploads/${req.file.filename}` : null;
    let extractedText = null;

    if (req.file && [".jpg", ".jpeg", ".png"].includes(path.extname(req.file.originalname).toLowerCase())) {
      const result = await Tesseract.recognize(req.file.path, "eng");
      extractedText = result.data.text;
    }

    const history = await MedicalHistory.create({
      PatientID: patient.PatientID,
      Type: req.body.type,
      Title: req.body.title,
      Description: req.body.description || null,
      Date: req.body.date || null,
      FileURL: fileURL,
      ExtractedText: extractedText
    });

    res.status(201).json({
      success: true,
      message: "Medical history added successfully",
      history
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Medical History
exports.getHistory = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const history = await MedicalHistory.findAll({
      where: { PatientID: patient.PatientID },
      order: [["Date", "DESC"]]
    });

    res.status(200).json({ success: true, history });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search Medical History
exports.searchHistory = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const { keyword, type, startDate, endDate } = req.query;

    const where = { PatientID: patient.PatientID };

    if (keyword) {
      where[Op.or] = [
        { Title: { [Op.like]: `%${keyword}%` } },
        { Description: { [Op.like]: `%${keyword}%` } },
        { ExtractedText: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (type) {
      where.Type = type;
    }

    if (startDate && endDate) {
      where.Date = { [Op.between]: [startDate, endDate] };
    }

    const history = await MedicalHistory.findAll({
      where,
      order: [["Date", "DESC"]]
    });

    res.status(200).json({ success: true, history });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Medical History
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await MedicalHistory.findByPk(id);

    if (!history) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    await history.destroy();

    res.status(200).json({ success: true, message: "Record deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};