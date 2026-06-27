const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ActivityLog = sequelize.define("ActivityLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  IPAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Status: {
    type: DataTypes.ENUM("success", "failed"),
    defaultValue: "success"
  }
}, { timestamps: true });

module.exports = ActivityLog;