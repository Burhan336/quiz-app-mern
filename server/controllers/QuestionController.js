const Question = require("../model/question");
const Exam = require("../model/exam");

const addQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    const exam = await Exam.findById(req.body.exam);
    if (!exam) {
      return res.status(404).json({
        error: "Exam not found",
        success: false,
      });
    }
    exam.questions.push(newQuestion._id);
    await exam.save();
    return res.status(200).json({
      message: "Question added successfully",
      success: true,
      data: newQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndUpdate(id, req.body);
    if (!question) {
      return res.status(404).json({
        error: "Question not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Question edited successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(req.body.examId);
    if (!exam) {
      return res.status(404).json({
        error: "Exam not found",
        success: false,
      });
    }
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({
        error: "Question not found",
        success: false,
      });
    }

    exam.questions = exam.questions.filter((question) => question._id !== id);
    await exam.save();
    return res.status(200).json({
      message: "Question deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};
const uploadCSV = async (req, res) => {
  try {
    const file = req.files.csvFile;

    const parser = fs
      .createReadStream(file.path)
      .pipe(parse({ delimiter: "," }));

    let questions = [];
    parser.on("data", (row) => {
      // Assuming CSV structure: question,correctOption,option1,option2,...
      const [name, correctOption, ...options] = row;
      questions.push({
        name,
        correctOption,
        options: options.reduce((acc, option, index) => {
          acc[`option${index + 1}`] = option;
          return acc;
        }, {}),
      });
    });

    parser.on("end", async () => {
      const createdQuestions = await Question.insertMany(questions);
      res.status(200).json({
        message: "CSV data uploaded successfully",
        questions: createdQuestions,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addQuestion, editQuestion, deleteQuestion, uploadCSV };
