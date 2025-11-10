import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import { toast, ToastContainer } from "react-toastify";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./signup.css"; // custom CSS

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    pass: "",
    cpass: "",
  });
  const [err, setErr] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showCpass, setShowCpass] = useState(false);
  const navigate = useNavigate();

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 900, once: false, mirror: true });
  }, []);

  // Regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;

  const validate = (name, value) => {
    const e = { ...err };
    if (name === "email")
      e.email = emailRegex.test(value) ? "" : "Invalid email format";
    if (name === "pass")
      e.pass = passRegex.test(value)
        ? ""
        : "Password must be 8+ chars & contain 1 special char";
    if (name === "cpass" || name === "pass")
      e.cpass =
        (name === "cpass" ? value : data.cpass) !==
        (name === "cpass" ? data.pass : value)
          ? "Passwords don’t match"
          : "";
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
      const res = await axios.post("http://localhost:8000/api/signup/", {
        FullName: data.name,
        Email: data.email,
        Password: data.pass,
      });

      if (res.status === 201) {
        toast.success("🎉 Signup Successful! Redirecting to login...", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });

        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErr({ email: "Email already exists" });
        toast.error("❌ Email already exists. Reloading...", {
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

      // ✅ Reload after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div
      className="signup-bg d-flex justify-content-center align-items-center vh-100"
      data-aos="fade-up"
    >
      <ToastContainer />
      <div
        className="card signup-card shadow-lg border-0 rounded-4 p-5"
        data-aos="zoom-in"
      >
        <h3 className="text-center text-primary fw-bold mb-3">
          Create Your Account
        </h3>
        <p className="text-center text-muted mb-4">
          Manage, track, and analyze your expenses with ease.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="form-control"
                value={data.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className={`form-control ${err.email ? "is-invalid" : ""}`}
                value={data.email}
                onChange={handleChange}
                required
              />
            </div>
            {err.email && <div className="text-danger small mt-1">{err.email}</div>}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Lock size={18} />
              </span>
              <input
                type={showPass ? "text" : "password"}
                name="pass"
                placeholder="Enter password"
                className={`form-control ${err.pass ? "is-invalid" : ""}`}
                value={data.pass}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {err.pass && <div className="text-danger small mt-1">{err.pass}</div>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Lock size={18} />
              </span>
              <input
                type={showCpass ? "text" : "password"}
                name="cpass"
                placeholder="Confirm password"
                className={`form-control ${err.cpass ? "is-invalid" : ""}`}
                value={data.cpass}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => setShowCpass(!showCpass)}
              >
                {showCpass ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {err.cpass && <div className="text-danger small mt-1">{err.cpass}</div>}
          </div>

          {/* General Error */}
          {err.general && (
            <div className="text-danger text-center small mb-3">
              {err.general}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold signup-btn"
          >
            Sign Up
          </button>

          <div className="text-center mt-3 small text-muted">
            Already have an account?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
