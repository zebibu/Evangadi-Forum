const express = require("express");
const router = express.Router();

// authenthication middleware
const authMiddleware = require('../middleware/authMiddleware')


// user controllers
const { register, login, checkuser } = require('../controller/userController')

// register route
router.post("/register", register)


// login user
router.post("/login", login)

//Check user
router.get("/check", authMiddleware, checkuser)


module.exports = router


