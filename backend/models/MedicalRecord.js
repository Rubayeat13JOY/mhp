const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MedicalRecord = sequelize.define("MedicalRecord", {
  RecordID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PatientID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, { timestamps: false });

module.exports = MedicalRecord;
