import React, { useState } from "react";
import axios from "axios";
import { Mail, Send, ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/forgetpassword/", {
        email: email,
      });

      if (res.data.sucess) {
        toast.success("📩 OTP sent successfully to your email!");
        // ✅ Pass email to /reset route
        setTimeout(() => navigate("/reset", { state: { email } }), 2000);
      } else {
        toast.error("Something went wrong, please try again!");
      }
    } catch (err) {
      toast.error("❌ Failed to send OTP. Check your email or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <div className="forgot-card">
        <div className="icon-circle">
          <Mail size={30} />
        </div>
        <h3>Forgot Password?</h3>
        <p className="text-muted">
          Enter your registered email to receive an OTP for password reset.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text bg-light border-0">
              <Mail size={18} className="text-primary" />
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control border-0 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ backgroundColor: "#f8f9fa", borderRadius: "0 8px 8px 0" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold shadow-sm rounded-pill"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"} <Send size={18} className="ms-1" />
          </button>
        </form>

        <div className="text-center mt-4">
          <span
            className="text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            <ArrowLeft size={16} /> Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
