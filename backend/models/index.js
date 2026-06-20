const sequelize = require("../config/db");

const User = require("./User");
const Patient = require("./Patient");
const Doctor = require("./Doctor");
const MedicalRecord = require("./MedicalRecord");
const Prescription = require("./Prescription");
const Report = require("./Report");
const Appointment = require("./Appointment");
const RefreshToken = require("./RefreshToken");
const MedicalHistory = require("./MedicalHistory");

// Associations
User.hasOne(Patient, { foreignKey: "UserID" });
Patient.belongsTo(User, { foreignKey: "UserID" });

User.hasOne(Doctor, { foreignKey: "UserID" });
Doctor.belongsTo(User, { foreignKey: "UserID" });

Patient.hasMany(MedicalRecord, { foreignKey: "PatientID" });
MedicalRecord.belongsTo(Patient, { foreignKey: "PatientID" });

Patient.hasMany(Prescription, { foreignKey: "PatientID" });
Prescription.belongsTo(Patient, { foreignKey: "PatientID" });

Doctor.hasMany(Prescription, { foreignKey: "DoctorID" });
Prescription.belongsTo(Doctor, { foreignKey: "DoctorID" });

Patient.hasMany(Report, { foreignKey: "PatientID" });
Report.belongsTo(Patient, { foreignKey: "PatientID" });

Patient.hasMany(Appointment, { foreignKey: "PatientID" });
Appointment.belongsTo(Patient, { foreignKey: "PatientID" });

Doctor.hasMany(Appointment, { foreignKey: "DoctorID" });
Appointment.belongsTo(Doctor, { foreignKey: "DoctorID" });

Patient.hasMany(MedicalHistory, { foreignKey: "PatientID" });
MedicalHistory.belongsTo(Patient, { foreignKey: "PatientID" });

module.exports = {
  sequelize,
  User,
  Patient,
  Doctor,
  MedicalRecord,
  Prescription,
  Report,
  Appointment,
  RefreshToken,
  MedicalHistory
};