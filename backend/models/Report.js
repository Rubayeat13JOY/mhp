const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Report = sequelize.define("Report", {
  ReportID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PatientID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Category: {
    type: DataTypes.ENUM(
      "blood_test",
      "xray",
      "mri",
      "ultrasound",
      "urine_test",
      "other"
    ),
    allowNull: true
  },
  FileURL: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ExtractedText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, { timestamps: false });

module.exports = Report;