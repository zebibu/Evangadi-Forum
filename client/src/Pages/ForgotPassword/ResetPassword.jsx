import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Api/axios";
import classes from "./Auth.module.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes["auth-container"]}>
      <div className={classes["auth-box"]}>
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p
            className={`${classes["auth-message"]} ${
              message.includes("success") ? classes.success : classes.error
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
