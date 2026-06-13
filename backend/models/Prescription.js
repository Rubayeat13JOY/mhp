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
    allowNull: false
  }
}, { timestamps: false });

module.exports = Prescription;