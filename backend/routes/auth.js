const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "Chill";

// User Model
const User = mongoose.model("User", new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

// Signup
router.post("/signup", async (req, res) => {
  const { mobile, password } = req.body;

  const userExists = await User.findOne({ mobile });
  if (userExists) return res.status(409).send("Mobile number already registered");

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ mobile, password: hashed });

  res.status(201).send("User registered with mobile number");
});

// Login
router.post("/login", async (req, res) => {
  const { mobile, password } = req.body;

  const user = await User.findOne({ mobile });
  if (!user) return res.status(401).send("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send("Invalid credentials");

  const token = jwt.sign({ mobile }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(403);

  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
};

// Protected route
router.get("/dashboard", authMiddleware, (req, res) => {
  res.send(`Welcome user with mobile ${req.user.mobile}, to the dashboard`);
});

module.exports = router;