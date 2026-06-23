const { RecordShare, Patient, Doctor, User } = require("../models");

// Patient shares access with a doctor
exports.shareAccess = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const { doctorId, permission, expiresAt } = req.body;

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const existing = await RecordShare.findOne({
      where: { PatientID: patient.PatientID, DoctorID: doctorId }
    });

    if (existing) {
      await existing.update({
        Permission: permission || "view",
        IsActive: true,
        ExpiresAt: expiresAt || null
      });
      return res.status(200).json({ success: true, message: "Access updated", share: existing });
    }

    const share = await RecordShare.create({
      PatientID: patient.PatientID,
      DoctorID: doctorId,
      Permission: permission || "view",
      ExpiresAt: expiresAt || null
    });

    res.status(201).json({ success: true, message: "Access shared successfully", share });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Patient revokes access
exports.revokeAccess = async (req, res) => {
  try {
    const { id } = req.params;

    const share = await RecordShare.findByPk(id);
    if (!share) {
      return res.status(404).json({ success: false, message: "Share record not found" });
    }

    await share.update({ IsActive: false });

    res.status(200).json({ success: true, message: "Access revoked successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Patient views who they've shared with
exports.getMyShares = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const patient = await Patient.findOne({ where: { UserID: user.id } });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const shares = await RecordShare.findAll({
      where: { PatientID: patient.PatientID },
      include: [{ model: Doctor, include: [{ model: User, attributes: ["name", "email"] }] }]
    });

    res.status(200).json({ success: true, shares });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor views patients shared with them
exports.getSharedWithMe = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const doctor = await Doctor.findOne({ where: { UserID: user.id } });

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const shares = await RecordShare.findAll({
      where: { DoctorID: doctor.DoctorID, IsActive: true },
      include: [{ model: Patient, include: [{ model: User, attributes: ["name", "email"] }] }]
    });

    res.status(200).json({ success: true, shares });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};