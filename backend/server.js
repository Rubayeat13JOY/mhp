require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db"); // Database connection import

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);

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