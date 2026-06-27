const { User, Patient, Doctor, Prescription, MedicalHistory, Report, RecordShare } = require("../models");

// User Statistics
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalPatients = await User.count({ where: { role: "patient" } });
    const totalDoctors = await User.count({ where: { role: "doctor" } });
    const totalAdmins = await User.count({ where: { role: "admin" } });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalAdmins
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// System Analytics
exports.getSystemAnalytics = async (req, res) => {
  try {
    const totalPrescriptions = await Prescription.count();
    const totalMedicalHistory = await MedicalHistory.count();
    const totalReports = await Report.count();
    const totalActiveShares = await RecordShare.count({ where: { IsActive: true } });

    res.status(200).json({
      success: true,
      analytics: {
        totalPrescriptions,
        totalMedicalHistory,
        totalReports,
        totalActiveShares
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Users (for management)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"]
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};