const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RecordShare = sequelize.define("RecordShare", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PatientID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  DoctorID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Permission: {
    type: DataTypes.ENUM("view", "edit"),
    defaultValue: "view"
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { timestamps: true });

module.exports = RecordShare;