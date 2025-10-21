const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

// ---------------------- CREATE A NEW QUESTION ----------------------
async function question(req, res) {
  const { title, description } = req.body;

  // Generate unique question ID
  const questionid = uuidv4();

  // Validate input
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide all required information",
    });
  }

  if (title.length > 200) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Title must be less than 200 characters",
    });
  }
  if (description.length > 1000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Description must be less than 1000 characters",
    });
  }
  try {
    // Get user info from auth middleware (JWT)
    const userid = req.user.userid;
    const username = req.user.username;

    // Extra safety: check for duplicate question ID (rare with UUID)
    const [existingQuestion] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (existingQuestion.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "Question ID already exists" });
    }

    // Insert new question into database
    await dbConnection.query(
      "INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)",
      [questionid, userid, title, description]
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Question added successfully",
      questionid,
    });
  } catch (error) {
    console.error("Error adding question:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, try again later",
    });
  }
}

// ---------------------- GET ALL QUESTIONS ----------------------
async function Allquestion(req, res) {
  try {
    // Join questions with users to include author's username
    const [results] = await dbConnection.query(
      `SELECT 
          questions.questionid AS question_id, 
          questions.title, 
          questions.description AS content, 
          users.username AS user_name 
       FROM questions 
       JOIN users ON questions.userid = users.userid 
       ORDER BY questions.id DESC`
    );

    return res.status(StatusCodes.OK).json({ questions: results });
  } catch (error) {
    console.error("Error retrieving questions:", error.message);
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No questions found" });
  }
}

// ---------------------- GET SINGLE QUESTION ----------------------
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

  if (!question_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide a question ID." });
  }

  try {
    // Query database for the specific question
    const [question] = await dbConnection.query(
      "SELECT questionid, title, description, created_at, userid FROM questions WHERE questionid = ?",
      [question_id]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No question found with this ID." });
    }

    return res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.error("Error retrieving question:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, please try again!",
    });
  }
}

module.exports = { question, Allquestion, getSingleQuestion };
