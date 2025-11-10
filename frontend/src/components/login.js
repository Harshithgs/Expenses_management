import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // ✅ your styling

const Login = () => {
  const [data, setData] = useState({ email: "", pass: "" });
  const [err, setErr] = useState({});
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (name, value) => {
    const e = { ...err };
    if (name === "email") e.email = emailRegex.test(value) ? "" : "Invalid email";
    setErr(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(err).some((v) => v)) return;

    try {
      const res = await axios.post("http://localhost:8000/api/login/", {
        Email: data.email,
        Password: data.pass,
      });

      if (res.status === 200) {
        const userId = res.data.userId;
        const username = res.data.username;

        // ✅ Save to local storage
        const userData = { id: userId, name: username };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("user_id", userId);
        localStorage.setItem("username", username);

        toast.success("🎉 Login Successful!", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });

        // ✅ Redirect to dashboard after success
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      // ✅ Handle login failure
      if (error.response?.status === 400) {
        setErr({ general: "Invalid email or password" });
        toast.error("❌ Invalid email or password. Reloading...", {
          position: "top-center",
          autoClose: 1000,
          theme: "colored",
        });
      } else {
        setErr({ general: "Something went wrong!" });
        toast.error("⚠️ Something went wrong. Reloading...", {
          position: "top-center",
          autoClose: 1000,
          theme: "colored",
        });
      }

      // ✅ Refresh page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />

      <div className="card login-card">
        {/* Header */}
        <div className="mb-4 text-center">
          <div className="login-icon">
            <LogIn size={28} />
          </div>
          <h3 className="fw-bold text-primary">Welcome Back</h3>
          <p className="text-muted small">Login to manage your expenses</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text">
                <Mail size={18} className="text-primary" />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className={`form-control ${err.email ? "is-invalid" : ""}`}
                value={data.email}
                onChange={handleChange}
                required
              />
            </div>
            {err.email && (
              <div className="text-danger small mt-1 text-start">{err.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={18} className="text-primary" />
              </span>
              <input
                type={showPass ? "text" : "password"}
                name="pass"
                placeholder="Password"
                className="form-control"
                value={data.pass}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text"
                onClick={() => setShowPass(!showPass)}
                style={{ cursor: "pointer" }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {err.general && (
            <div className="text-danger small text-center mb-3">{err.general}</div>
          )}

          <button type="submit" className="btn btn-primary w-100 py-2 login-btn">
            Login
          </button>

          {/* Forgot Password */}
          <div className="mt-3 text-center">
            <span
              className="forgot-password"
              onClick={() => navigate("/forgot-password")}
              style={{ cursor: "pointer" }}
            >
              Forgot Password?
            </span>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            Don’t have an account?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
