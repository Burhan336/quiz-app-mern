const Exam = require("../model/exam");
const User = require("../model/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "burhansq0@gmail.com",
    pass: "hcpuejyzfeqrigiv",
  },
});

const addExam = async (req, res) => {
  try {
    req.body.questions = [];
    const newExam = new Exam(req.body);
    await newExam.save();

    // Fetch all users
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).json({
        error: "No users found",
        success: false,
      });
    }

    // Using Promise.all to wait for all emails to be sent
    await Promise.all(
      users.map(async (user) => {
        const emailOptions = {
          from: "burhansq0@gmail.com",
          to: user.email,
          subject: "New Quiz Created",
          text: `Dear ${user.name},\n\nA new quiz has been created. Check it out now!\n\nBest regards,\nAdmin`,
        };

        await transporter.sendMail(emailOptions);
      })
    );

    return res.status(200).json({
      message: "Exam added successfully",
      data: newExam,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({});
    if (!exams) {
      return res.status(404).json({
        error: "No exams found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      data: exams,
      message: "Exams fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("questions");
    if (!exam) {
      return res.status(404).json({
        error: "Exam not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      data: exam,
      message: "Exam fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const editExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByIdAndUpdate(id, req.body);
    if (!exam) {
      return res.status(404).json({
        success: false,
        error: "Exam not found",
      });
    }
    return res.status(200).json({
      message: "Exam edited successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        error: "Exam not found",
      });
    }
    exam.remove();
    return res.status(200).json({
      message: "Exam deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};
module.exports = { addExam, getAllExams, getExamById, editExam, deleteExam };
