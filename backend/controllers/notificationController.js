const { Notification, User } = require("../models");

// Get all notifications for logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    const notifications = await Notification.findAll({
      where: { UserID: user.id },
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({ success: true, notifications });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    await notification.update({ IsRead: true });

    res.status(200).json({ success: true, message: "Marked as read" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    await notification.destroy();

    res.status(200).json({ success: true, message: "Notification deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function - other controllers use this to create notifications
exports.createNotification = async (userId, message, type = "general") => {
  try {
    await Notification.create({
      UserID: userId,
      Message: message,
      Type: type
    });
  } catch (error) {
    console.error("Notification creation failed:", error);
  }
};