const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Doctor = sequelize.define("Doctor", {
  DoctorID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Specialization: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, { timestamps: false });

module.exports = Doctor;