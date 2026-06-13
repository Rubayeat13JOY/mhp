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
  MedicalInformation: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, { timestamps: false });

module.exports = Patient;