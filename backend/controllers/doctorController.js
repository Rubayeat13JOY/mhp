const { Doctor, User, Patient, Prescription, MedicalHistory, Report, RecordShare } = require("../models");
const { createNotification } = require("./notificationController");

// Get Doctor Profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const doctor = await Doctor.findOne({ where: { UserID: user.id } });

    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        specialization: doctor?.Specialization || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Doctor Profile
exports.updateDoctorProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    let doctor = await Doctor.findOne({ where: { UserID: user.id } });

    if (doctor) {
      await doctor.update({ Specialization: req.body.specialization });
    } else {
      doctor = await Doctor.create({
        UserID: user.id,
        Specialization: req.body.specialization
      });
    }

    res.status(200).json({ success: true, message: "Profile updated", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all patients shared with this doctor
exports.getMyPatients = async (req, res) => {
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

    res.status(200).json({ success: true, patients: shares });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor views a specific patient's prescriptions (only if shared)
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });
    const doctor = await Doctor.findOne({ where: { UserID: user.id } });

    const share = await RecordShare.findOne({
      where: { DoctorID: doctor.DoctorID, PatientID: patientId, IsActive: true }
    });

    if (!share) {
      return res.status(403).json({ success: false, message: "Access not granted by patient" });
    }

    const prescriptions = await Prescription.findAll({ where: { PatientID: patientId } });

    res.status(200).json({ success: true, prescriptions });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor creates/updates a prescription for a patient (only if edit permission)
exports.createPrescriptionForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });
    const doctor = await Doctor.findOne({ where: { UserID: user.id } });

    const share = await RecordShare.findOne({
      where: { DoctorID: doctor.DoctorID, PatientID: patientId, IsActive: true }
    });

    if (!share) {
      return res.status(403).json({ success: false, message: "Access not granted by patient" });
    }

    if (share.Permission !== "edit") {
      return res.status(403).json({ success: false, message: "View-only access. Cannot edit." });
    }

    const prescription = await Prescription.create({
      PatientID: patientId,
      DoctorID: doctor.DoctorID,
      MedicineName: req.body.medicineName,
      Dosage: req.body.dosage,
      Notes: req.body.notes,
      UploadedBy: "doctor"
    });

    // Notify patient
    const patient = await Patient.findByPk(patientId);
    if (patient) {
      await createNotification(
        patient.UserID,
        `Dr. ${user.name} added a new prescription for you: ${req.body.medicineName}`,
        "prescription"
      );
    }

    res.status(201).json({ success: true, message: "Prescription created", prescription });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor views patient's medical history (only if shared)
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });
    const doctor = await Doctor.findOne({ where: { UserID: user.id } });

    const share = await RecordShare.findOne({
      where: { DoctorID: doctor.DoctorID, PatientID: patientId, IsActive: true }
    });

    if (!share) {
      return res.status(403).json({ success: false, message: "Access not granted by patient" });
    }

    const history = await MedicalHistory.findAll({ where: { PatientID: patientId } });

    res.status(200).json({ success: true, history });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor views patient's reports (only if shared)
exports.getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });
    const doctor = await Doctor.findOne({ where: { UserID: user.id } });

    const share = await RecordShare.findOne({
      where: { DoctorID: doctor.DoctorID, PatientID: patientId, IsActive: true }
    });

    if (!share) {
      return res.status(403).json({ success: false, message: "Access not granted by patient" });
    }

    const reports = await Report.findAll({ where: { PatientID: patientId } });

    res.status(200).json({ success: true, reports });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};