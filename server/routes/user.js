const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "burhansq0@gmail.com",
    pass: "hcpuejyzfeqrigiv",
  },
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailOptions = {
      from: "burhansq0@gmail.com",
      to: email,
      subject: "New Quiz Created",
      text: `Dear ${name},\n\nYour account has been created!\n\nBest regards,\nAdmin`,
    };
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        error: "User with this email already exists",
        success: false,
      });
    }
    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save();
    await transporter.sendMail(emailOptions);
    return res.status(200).json({
      newUser,
      message: "Account created successfully! Login to continue",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Invalid email/password",
      });
    }
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(400).json({
        error: "Invalid email/password",
        success: false,
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: token,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

router.get("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "User data fetched successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

module.exports = router;
