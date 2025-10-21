const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise"); // Promise-based mysql2

// Ensure required environment variables exist
const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME", "DB_PORT"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    `❌ Missing environment variables: ${missingEnv.join(
      ", "
    )}. Please check your .env file.`
  );
  process.exit(1);
}

// SSL options for Aiven
const caPath = path.join(__dirname, "../config/ca.pem");
if (!fs.existsSync(caPath)) {
  console.error("❌ CA certificate not found at config/ca.pem");
  process.exit(1);
}
const sslOptions = {
  ca: fs.readFileSync(caPath),
  rejectUnauthorized: true,
};

// Create a promise-based connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslOptions,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000, // 10 seconds
  ssl: {
    rejectUnauthorized: false, // ⚠️ disables verification of the certificate
  },
});

console.log("✅ MySQL promise-based pool created");

module.exports = pool;
