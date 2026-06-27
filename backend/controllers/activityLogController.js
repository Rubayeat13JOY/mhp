const { ActivityLog, User } = require("../models");

// Helper function - other controllers use this to log activity
exports.logActivity = async (userId, action, description, status = "success", ipAddress = null) => {
  try {
    await ActivityLog.create({
      UserID: userId,
      Action: action,
      Description: description,
      Status: status,
      IPAddress: ipAddress
    });
  } catch (error) {
    console.error("Activity log creation failed:", error);
  }
};

// Get all activity logs (admin only)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [{ model: User, attributes: ["name", "email", "role"] }],
      order: [["createdAt", "DESC"]],
      limit: 100
    });

    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get failed login attempts (security monitoring)
exports.getFailedLogins = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { Action: "login", Status: "failed" },
      include: [{ model: User, attributes: ["name", "email", "role"] }],
      order: [["createdAt", "DESC"]],
      limit: 50
    });

    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};