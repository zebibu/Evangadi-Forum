const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
dotenv.config();
async function authMiddleware(req, res, next) {
  // 1️⃣ Get the Authorization header
  const authHeader = req.headers.authorization;

  // 2️⃣ Check if token exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }

  // 3️⃣ Extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // 4️⃣ Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Attach user info to request object
    req.user = {
      username: decoded.username,
      userid: decoded.userid,
    };

    // 6️⃣ Pass control to next middleware or route
    next();
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
}

module.exports = authMiddleware