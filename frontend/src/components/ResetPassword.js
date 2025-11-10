import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, KeyRound, ShieldCheck } from "lucide-react";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";

  const [formData, setFormData] = useState({
    Email: emailFromState,
    otp: "",
    Password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*]).{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include one special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "Password") validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (passwordError) {
      setMessage("⚠️ Please fix the password requirements before submitting.");
      return;
    }

    if (formData.Password !== formData.confirmPassword) {
      setMessage("⚠️ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/reset/", formData);
      if (response.data.success) {
        setMessage("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("❌ " + (response.data.message || "Error resetting password"));
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <div className="icon-circle">
          <ShieldCheck size={36} />
        </div>

        <h2 className="reset-title">Reset Your Password</h2>
        <p className="reset-subtitle">
          Please enter the OTP sent to your email and create a new secure password.
        </p>

        <form onSubmit={handleSubmit} className="reset-form">
          <input type="hidden" name="Email" value={formData.Email} />

          {/* OTP Field */}
          <div className="input-group mb-4">
            <span className="input-icon">
              <KeyRound size={18} />
            </span>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="form-control reset-input"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>

          {/* New Password Field */}
          <div className="input-group mb-4">
            <span className="input-icon">
              <Lock size={18} />
            </span>
            <input
              type="password"
              name="Password"
              placeholder="Enter new password"
              className="form-control reset-input"
              value={formData.Password}
              onChange={handleChange}
              required
            />
          </div>

          {passwordError && <p className="validation-text">{passwordError}</p>}

          {/* Confirm Password Field */}
          <div className="input-group mb-4">
            <span className="input-icon">
              <Lock size={18} />
            </span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="form-control reset-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {message && <p className="response-message">{message}</p>}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold shadow-sm rounded-pill"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span
            className="text-primary fw-semibold back-link"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
