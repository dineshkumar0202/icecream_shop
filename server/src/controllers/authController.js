const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  try {
    const { username, password, branch } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const u = new User({ 
      username, 
      password: hashed, 
      role: 'branch', // Default role for new users
      branch: branch || 'New Branch' 
    });
    await u.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: u._id, role: u.role, branch: u.branch },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );
    
    res.json({ 
      message: "Registration successful",
      token, 
      role: u.role, 
      branch: u.branch, 
      username: u.username 
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const u = await User.findOne({ username });
    if (!u) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: u._id, role: u.role, branch: u.branch },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );
    res.json({ 
      message: "Login successful",
      token, 
      role: u.role, 
      branch: u.branch, 
      username: u.username 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
