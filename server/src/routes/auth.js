// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, password, branch } = req.body;

    // Validate input
    if (!username || username.length < 5) {
      return res.status(400).json({ message: "Username must be at least 5 characters long" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (default role is 'branch')
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'branch',
      branch: branch || 'New Branch'
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, branch: newUser.branch },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );

    res.json({ 
      message: "Registration successful", 
      token, 
      role: newUser.role, 
      branch: newUser.branch,
      username: newUser.username
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Use bcrypt to compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, branch: user.branch },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );

    res.json({ 
      message: "Login successful", 
      token, 
      role: user.role, 
      branch: user.branch,
      username: user.username
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
    