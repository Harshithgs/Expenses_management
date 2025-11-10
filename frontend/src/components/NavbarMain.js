import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, LogIn, UserPlus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const NavbarMain = () => {
  const location = useLocation();

  // Optional: dynamically add a shadow on scroll
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark py-3 sticky-top custom-navbar ${
        scrolled ? "navbar-scrolled" : ""
      }`}
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

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <Link
                className={`nav-link fw-semibold d-flex align-items-center gap-2 ${
                  location.pathname === "/login" ? "active" : "text-light"
                }`}
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMain;
