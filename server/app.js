// app.js

// -------------------------------
// Import dependencies
// -------------------------------
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// -------------------------------
// Import routes and middleware
// -------------------------------
const answerRoutes = require("./routes/answerRoute");
const questionRoutes = require("./routes/questionRoute");
const userRoutes = require("./routes/userRoute");
const aiRoute = require("./routes/aiRoute");
const authRoutes = require("./routes/authRoute");
const installRoutes = require("./routes/installRoute");
const groupRoutes = require("./routes/groupRoute");
const authMiddleware = require("./middleware/authMiddleware");
const db = require("./db/dbConfig"); // Promise-based pool

// -------------------------------
// Initialize app
// -------------------------------
const app = express();
const port = process.env.PORT || 14255;

// -------------------------------
// Middleware
// -------------------------------
app.use(cors());
app.use(express.json());

// -------------------------------
// Test route
// -------------------------------
app.get("/", (req, res) => {
  res.send("Hello from Evangadi Forum!");
});

// -------------------------------
// API routes
// -------------------------------
app.use("/", installRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, questionRoutes);
app.use("/api", authMiddleware, answerRoutes);
app.use("/api/ai", authMiddleware, aiRoute);
app.use("/api/groups", authMiddleware, groupRoutes);

// -------------------------------
// Attempt database connection
// -------------------------------
async function start() {
  try {
    // Test a simple query to confirm connection
    await db.query("SELECT 1");
    console.log("✅ Database connection established");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Stop app if DB connection fails
  }

  // Start server
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

// -------------------------------
// Start the app
// -------------------------------
start();
