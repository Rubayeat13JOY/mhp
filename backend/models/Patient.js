const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Patient = sequelize.define("Patient", {
  PatientID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  DateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Gender: {
    type: DataTypes.ENUM("male", "female", "other"),
    allowNull: true
  },
  BloodGroup: {
    type: DataTypes.STRING,
    allowNull: true
  },
  EmergencyContactName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  EmergencyContactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  InsuranceProvider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  InsuranceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  MedicalPreferences: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, { timestamps: false });

module.exports = Patient;