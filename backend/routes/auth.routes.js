const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------------------------------------------------
// REGISTER ROUTE: Handles New User Creation
// ---------------------------------------------------------
router.post("/register", async (req, res) => {
  try {
    // ✨ Destructuring name, email, password, contact, and role from request body
    const { name, email, password, contact, role } = req.body;

    // Check if user already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Hash the password for security before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance with the contact number
    user = new User({
      name,
      email,
      password: hashedPassword,
      contact, // ✨ Saving the contact number here
      role: role || "tenant" // Default to tenant if role is not provided
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully! You can now login." });
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// ---------------------------------------------------------
// LOGIN ROUTE: Handles User Authentication
// ---------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check if the user is blocked by the admin
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked. Please contact support." });
    }

    // Validate password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate a JWT Token for the session
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    // Send token and user info back to frontend
    res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user._id
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;
