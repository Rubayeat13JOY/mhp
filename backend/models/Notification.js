const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Type: {
    type: DataTypes.ENUM(
      "prescription",
      "report",
      "appointment",
      "medication_reminder",
      "vaccination_reminder",
      "checkup_reminder",
      "general"
    ),
    defaultValue: "general"
  },
  IsRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { timestamps: true });

module.exports = Notification;