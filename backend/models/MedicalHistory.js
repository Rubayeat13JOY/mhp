const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MedicalHistory = sequelize.define("MedicalHistory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PatientID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Type: {
    type: DataTypes.ENUM(
      "disease",
      "surgery",
      "allergy",
      "vaccination",
      "family_history",
      "chronic_disease"
    ),
    allowNull: false
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  FileURL: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ExtractedText: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, { timestamps: false });

module.exports = MedicalHistory;