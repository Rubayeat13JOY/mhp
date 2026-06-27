require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const medicalHistoryRoutes = require("./routes/medicalHistoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const recordShareRoutes = require("./routes/recordShareRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const verifyToken = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/medical-history", medicalHistoryRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/record-share", recordShareRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Health API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server Running"
    });
});

// Protected Route
app.get("/api/profile", verifyToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync({ force: false })
    .then(() => {
        console.log("Database connected & synced successfully.");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });