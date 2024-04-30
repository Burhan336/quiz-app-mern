const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Report = require("../model/reports");

router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    return res.status(200).json({
      message: "Report added succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({}).populate("exam").populate("user");

    return res.status(200).json({
      message: "Report fetched succesfully",
      success: true,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.body.userId })
      .populate("exam")
      .populate("user");
    return res.status(200).json({
      message: "Report fetched succesfully",
      success: true,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

module.exports = router;
