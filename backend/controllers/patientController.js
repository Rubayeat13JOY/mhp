const { Patient, User } = require("../models");

// Get Patient Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const patient = await Patient.findOne({ where: { UserID: user.id } });

    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        phone: patient?.Phone || null,
        address: patient?.Address || null,
        dateOfBirth: patient?.DateOfBirth || null,
        gender: patient?.Gender || null,
        bloodGroup: patient?.BloodGroup || null,
        emergencyContactName: patient?.EmergencyContactName || null,
        emergencyContactPhone: patient?.EmergencyContactPhone || null,
        insuranceProvider: patient?.InsuranceProvider || null,
        insuranceNumber: patient?.InsuranceNumber || null,
        medicalPreferences: patient?.MedicalPreferences || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or Update Patient Profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const {
      phone,
      address,
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContactName,
      emergencyContactPhone,
      insuranceProvider,
      insuranceNumber,
      medicalPreferences
    } = req.body;

    let patient = await Patient.findOne({ where: { UserID: user.id } });

    if (patient) {
      await patient.update({
        Phone: phone,
        Address: address,
        DateOfBirth: dateOfBirth,
        Gender: gender,
        BloodGroup: bloodGroup,
        EmergencyContactName: emergencyContactName,
        EmergencyContactPhone: emergencyContactPhone,
        InsuranceProvider: insuranceProvider,
        InsuranceNumber: insuranceNumber,
        MedicalPreferences: medicalPreferences
      });
    } else {
      patient = await Patient.create({
        UserID: user.id,
        Phone: phone,
        Address: address,
        DateOfBirth: dateOfBirth,
        Gender: gender,
        BloodGroup: bloodGroup,
        EmergencyContactName: emergencyContactName,
        EmergencyContactPhone: emergencyContactPhone,
        InsuranceProvider: insuranceProvider,
        InsuranceNumber: insuranceNumber,
        MedicalPreferences: medicalPreferences
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};