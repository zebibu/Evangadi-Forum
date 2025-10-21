// ---------------------- IMPORT DEPENDENCIES ----------------------
const {StatusCodes} = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

// ---------------------- POST AN ANSWER ----------------------
async function postAnswer(req, res) {
  const {answer} = req.body;
  const {questionid} = req.params;

  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide all required information",
    });
  }

  try {
    const userid = req.user.userid;
    const username = req.user.username;

    await dbConnection.query(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
      [questionid, userid, answer]
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Answer added successfully",
    });
  } catch (error) {
    console.error("Error while posting answer:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, try again later",
    });
  }
}
// ---------------------- GET ANSWERS FOR A QUESTION ----------------------
async function getAnswer(req, res) {
  const { questionid } = req.params; // Get question ID from URL

  // 1️⃣ Validate input: ensure question ID is provided
  if (!questionid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide a question ID.",
    });
  }

  try {
    // 2️⃣ Check if the question exists in the database
    const [questions] = await dbConnection.query(
      "SELECT questionid FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No question found with this ID.",
      });
    }

    // 3️⃣ Retrieve all answers for this question along with user info
    const [answers] = await dbConnection.query(
      `SELECT 
         answers.answerid, 
         answers.answer, 
         answers.userid, 
         answers.created_at, 
         users.username AS user_name 
       FROM answers 
       JOIN users ON answers.userid = users.userid 
       WHERE questionid = ?`,
      [questionid]
    );

    // 4️⃣ Respond with answers
    return res.status(StatusCodes.OK).json({
      questionid,
      answers,
    });
  } catch (error) {
    console.error("Error while retrieving answers:", error.message);
    // 5️⃣ Handle unexpected server errors
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, please try again!",
    });
  }
}

// ---------------------- EXPORT CONTROLLER FUNCTIONS ----------------------
module.exports = { postAnswer, getAnswer };

