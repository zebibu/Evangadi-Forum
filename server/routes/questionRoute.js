const express = require("express");
const router = express.Router();

const {
  question,
  Allquestion,
  getSingleQuestion,
} = require("../controller/questionController");



//post quistion
router.post("/question",  question);

// Get all questions
router.get("/question", Allquestion);

// Get single question
router.get("/question/:question_id", getSingleQuestion);

module.exports = router;
