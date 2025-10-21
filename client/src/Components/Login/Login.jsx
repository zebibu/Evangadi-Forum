import { Link, useNavigate } from "react-router-dom";
import axios from "../../Api/axios";
import classes from "./Login.module.css";
import { useContext, useState } from "react";
import { AppState } from "../../context/DataContext";
import { BiHide, BiShow } from "react-icons/bi";
import { ClipLoader } from "react-spinners";

function Login({ visible }) {
  const { setShow } = visible;
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AppState);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(""); // reset errors
    setIsLoading(true);

    // Simple client-side validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please provide both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/user/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // Save token + user info
        localStorage.setItem("token", response.data.token);
        setUser(response.data.username);

        // Redirect to homepage
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error
        setErrorMessage(error.response.data.message || "Invalid credentials.");
      } else {
        // Network/connection error
        setErrorMessage("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={classes.signIn_container}>
      <h1>Login to your account</h1>
      <p>
        Don’t have an account?{" "}
        <Link onClick={() => setShow(true)}>Create a new account?</Link>
      </p>

      {/* Show error message */}
      {errorMessage && <p className={classes.error_message}>{errorMessage}</p>}

      <form onSubmit={handleSubmit} className={classes.signIn_form}>
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Password Input */}
        <div className={classes.password_field}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={classes.toggle_password}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <BiShow size={20} color="#E58600" />
            ) : (
              <BiHide size={20} color="#E58600" />
            )}
          </button>
        </div>
        <p className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
        {/* Submit Button */}
        <button className={classes.submit} type="submit" disabled={isLoading}>
          {isLoading ? <ClipLoader size={12} color="gray" /> : "Sign In"}
        </button>
      </form>
    </section>
  );
}

export default Login;
