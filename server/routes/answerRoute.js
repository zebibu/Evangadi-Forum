
const express = require("express");
const router = express.Router();

// Import controller functions
const { postAnswer, getAnswer } = require("../controller/answerController");


// Import authentication middleware

router.post("/answer/:questionid",  postAnswer);

router.get("/answer/:questionid",  getAnswer);

module.exports = router;
