const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../db/dbConfig");
const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      "UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?",
      [token, expires, email]
    );

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const htmlContent = `
      <h3>Password Reset Request</h3>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `;

    await sendEmail(email, "Reset Your Password", htmlContent);

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending reset email." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()",
      [token]
    );

    if (users.length === 0)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE userid = ?",
      [hashed, users[0].userid]
    );

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password." });
  }
};
