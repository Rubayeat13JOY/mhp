const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Prescription = sequelize.define("Prescription", {
  PrescriptionID: {
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
  MedicineName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Dosage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  UploadedBy: {
    type: DataTypes.ENUM("patient", "doctor"),
    defaultValue: "patient"
  }
}, { timestamps: false });

module.exports = Prescription;