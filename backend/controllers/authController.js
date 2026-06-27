const { User, RefreshToken } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { logActivity } = require("./activityLogController");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Block admin registration through the public API
    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be created through registration"
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "doctor" ? "doctor" : "patient"
    });

    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await RefreshToken.create({
      token: refreshToken,
      userEmail: user.email,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await logActivity(user.id, "register", `New ${user.role} account created: ${user.email}`, "success", req.ip);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      accessToken,
      refreshToken,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      await logActivity(null, "login", `Failed login attempt for unknown email: ${email}`, "failed", req.ip);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await logActivity(user.id, "login", `Failed login attempt: wrong password`, "failed", req.ip);
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await RefreshToken.create({
      token: refreshToken,
      userEmail: user.email,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await logActivity(user.id, "login", `${user.role} logged in: ${user.email}`, "success", req.ip);

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};