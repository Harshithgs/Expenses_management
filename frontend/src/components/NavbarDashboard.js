import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  BarChart3,
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  FileBarChart, // ✅ Added icon for Report
  User,
  LogOut,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: false, mirror: true });

    const handleScroll = () => {
      const navbar = document.querySelector(".custom-navbar");
      if (window.scrollY > 50) navbar.classList.add("shrink");
      else navbar.classList.remove("shrink");
    };
    window.addEventListener("scroll", handleScroll);

    // ✅ Check login state on mount
    const checkLogin = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    checkLogin();

    // ✅ Listen for login/logout updates in localStorage
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark py-3 shadow-sm sticky-top custom-navbar"
      data-aos="fade-down"
    >
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4"
          to="/"
        >
          <BarChart3 size={24} />
          Expense Tracker
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-semibold d-flex align-items-center gap-2 hover-underline"
                    to="/dashboard"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-semibold d-flex align-items-center gap-2 hover-underline"
                    to="/add-expense"
                  >
                    <PlusCircle size={18} />
                    Add Expense
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-semibold d-flex align-items-center gap-2 hover-underline"
                    to="/manage-expense"
                  >
                    <ListChecks size={18} />
                    Manage Expense
                  </Link>
                </li>

                {/* ✅ New Report link */}
                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-semibold d-flex align-items-center gap-2 hover-underline"
                    to="/report"
                  >
                    <FileBarChart size={18} />
                    Report
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-semibold d-flex align-items-center gap-2 hover-underline"
                    to="/profile"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-light text-primary fw-semibold d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm hover-glow border-0"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-semibold d-flex align-items-center gap-2 hover-underline"
                    to="/login"
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn btn-light text-primary fw-semibold d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm hover-glow"
                    to="/signup"
                  >
                    <UserPlus size={18} />
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
