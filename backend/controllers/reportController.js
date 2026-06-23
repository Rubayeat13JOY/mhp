const { Report, Patient, User } = require("../models");
const Tesseract = require("tesseract.js");
const path = require("path");
const { Op } = require("sequelize");

// Upload Report
exports.uploadReport = async (req, res) => {
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

    const report = await Report.create({
      PatientID: patient.PatientID,
      Title: req.body.title,
      Category: req.body.category || "other",
      FileURL: fileURL,
      ExtractedText: extractedText,
      Description: req.body.description || null,
      Date: req.body.date || null
    });

    res.status(201).json({
      success: true,
      message: "Report uploaded successfully",
      report
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Reports
exports.getReports = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const reports = await Report.findAll({
      where: { PatientID: patient.PatientID },
      order: [["Date", "DESC"]]
    });

    res.status(200).json({ success: true, reports });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search Reports
exports.searchReports = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const { keyword, category, startDate, endDate } = req.query;

    const where = { PatientID: patient.PatientID };

    if (keyword) {
      where[Op.or] = [
        { Title: { [Op.like]: `%${keyword}%` } },
        { Description: { [Op.like]: `%${keyword}%` } },
        { ExtractedText: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (category) {
      where.Category = category;
    }

    if (startDate && endDate) {
      where.Date = { [Op.between]: [startDate, endDate] };
    }

    const reports = await Report.findAll({
      where,
      order: [["Date", "DESC"]]
    });

    res.status(200).json({ success: true, reports });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Report
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    await report.destroy();

    res.status(200).json({ success: true, message: "Report deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};