const express = require("express");
const router = express.Router();
const { askAI } = require("../controller/aiController");

router.post("/ask",  askAI);

module.exports = router;
