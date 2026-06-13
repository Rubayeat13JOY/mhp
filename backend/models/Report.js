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
  FileURL: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, { timestamps: false });

module.exports = Report;