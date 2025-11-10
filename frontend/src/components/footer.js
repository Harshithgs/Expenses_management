import React from "react";
import { Globe, Instagram, Linkedin, Twitter } from "lucide-react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer text-light py-4 mt-5">
      <div className="container text-center">
        {/* Company Name */}
        <h5 className="mb-3 fw-bold gradient-text">Expense Tracker</h5>

        {/* Social Media Icons */}
        <div className="d-flex justify-content-center gap-4 mb-3">
          <a
            href="https://mycompany.com"
            className="social-link"
            target="_blank"
            rel="noreferrer"
            title="Website"
          >
            <Globe size={22} />
          </a>

          <a
            href="https://twitter.com"
            className="social-link"
            target="_blank"
            rel="noreferrer"
            title="Twitter"
          >
            <Twitter size={22} />
          </a>

          <a
            href="https://instagram.com"
            className="social-link"
            target="_blank"
            rel="noreferrer"
            title="Instagram"
          >
            <Instagram size={22} />
          </a>

          <a
            href="https://linkedin.com"
            className="social-link"
            target="_blank"
            rel="noreferrer"
            title="LinkedIn"
          >
            <Linkedin size={22} />
          </a>
        </div>

        {/* Copyright */}
        <p className="mb-0 small text-white-50">
          © {new Date().getFullYear()} Expense Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
