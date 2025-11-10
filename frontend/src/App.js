import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavbarMain from "./components/NavbarMain";
import NavbarDashboard from "./components/NavbarDashboard";
import Footer from "./components/footer";
import 'bootstrap/dist/css/bootstrap.min.css';

import Signup from "./components/signup";
import Login from "./components/login";
import Home from "./components/home";
import Dashboard from "./components/Dashboard";
import ForgotPasswords from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AddExpense from "./components/AddExpense";
import ManageExpense from "./components/ManageExpense";
import Report from "./components/Report";
import Profile from "./components/Profile";

const AppContent = () => {
  const location = useLocation();

  // ✅ Routes where the dashboard navbar should appear
  const dashboardRoutes = [
    "/dashboard",
    "/add-expense",
    "/manage-expense",
    "/report",
    "/profile",
  ];

  const isDashboardRoute = dashboardRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {/* ✅ Show NavbarMain before login, NavbarDashboard after login */}
      {isDashboardRoute ? <NavbarDashboard /> : <NavbarMain />}

      <div className="content" style={{ minHeight: "85vh" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPasswords />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/manage-expense" element={<ManageExpense />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      {/* ✅ Optional: hide footer for dashboard pages */}
      {<Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
