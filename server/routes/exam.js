const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const ExamController = require("../controllers/ExamController");
const QuestionController = require("../controllers/QuestionController");

//Exams
router.post("/add", authMiddleware, ExamController.addExam);
router.get("/get-all-exams", authMiddleware, ExamController.getAllExams);
router.get("/get-exam-by-id/:id", authMiddleware, ExamController.getExamById);
router.post("/edit/:id", authMiddleware, ExamController.editExam);
router.delete("/delete/:id", authMiddleware, ExamController.deleteExam);

//Questions
router.post("/add-question", authMiddleware, QuestionController.addQuestion);
router.post(
  "/edit-question-in-exam/:id",
  authMiddleware,
  QuestionController.editQuestion
);
router.post(
  "/delete-question/:id",
  authMiddleware,
  QuestionController.deleteQuestion
);

// router.post("/upload-csv", authMiddleware, QuestionController.uploadCSV);

module.exports = router;
