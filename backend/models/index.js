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
const RecordShare = require("./RecordShare");
const Notification = require("./Notification");
const ActivityLog = require("./ActivityLog");

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

// Many-to-Many: Patient <-> Doctor (via RecordShare)
Patient.belongsToMany(Doctor, { through: RecordShare, foreignKey: "PatientID" });
Doctor.belongsToMany(Patient, { through: RecordShare, foreignKey: "DoctorID" });

Patient.hasMany(RecordShare, { foreignKey: "PatientID" });
RecordShare.belongsTo(Patient, { foreignKey: "PatientID" });

Doctor.hasMany(RecordShare, { foreignKey: "DoctorID" });
RecordShare.belongsTo(Doctor, { foreignKey: "DoctorID" });

// Notification
User.hasMany(Notification, { foreignKey: "UserID" });
Notification.belongsTo(User, { foreignKey: "UserID" });

// Activity Log
User.hasMany(ActivityLog, { foreignKey: "UserID" });
ActivityLog.belongsTo(User, { foreignKey: "UserID" });

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
  MedicalHistory,
  RecordShare,
  Notification,
  ActivityLog
};