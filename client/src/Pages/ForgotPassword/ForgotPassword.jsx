import { useState } from "react";
import axios from "../../Api/axios";
import classes from "./Auth.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
        setMessage("Error sending reset link.");
        console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes["auth-container"]}>
      <div className={classes["auth-box"]}>
        <h2>Forgot Password</h2>
        <p>Enter your registered email to receive a reset link.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && (
          <p
            className={`${classes["auth-message"]} ${
              message.includes("sent") ? classes.success : classes.error
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
