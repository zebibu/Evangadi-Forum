const express = require("express");
const router = express.Router();

// Import controller function
const { install } = require("../controller/installController");

router.get("/install", install);

module.exports = router;
