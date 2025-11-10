import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Phone,
  DollarSign,
  Target,
  Edit3,
  Save,
  X,
  Upload,
  Trash2,
} from "lucide-react";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || localStorage.getItem("user_id");

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [form, setForm] = useState({
    monthly_income: "",
    phone_number: "",
    monthly_budget: "",
    savings_goal: "",
    profile_image: null,
  });

  const formatNumber = (num) =>
    num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/viewprofile/${userId}/`
        );
        if (res.data.success) setProfile(res.data.profile);
      } catch {
        toast.error("Failed to load profile!");
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setForm({ ...form, profile_image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append(
      "monthly_income",
      form.monthly_income || profile.monthly_income
    );
    formData.append("phone_number", form.phone_number || profile.phone_number);
    formData.append(
      "monthly_budget",
      form.monthly_budget || profile.monthly_budget
    );
    formData.append("savings_goal", form.savings_goal || profile.savings_goal);
    if (form.profile_image) formData.append("profile_image", form.profile_image);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/editprofile/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setProfile(res.data.data);
        setIsEditing(false);
      }
    } catch {
      toast.error("Failed to update profile!");
    }
  };

  const confirmDeleteUser = async () => {
    try {
      const res = await axios.delete(
        `http://127.0.0.1:8000/api/deleteuser/${userId}/`
      );
      if (res.status === 200) {
        toast.success("Account deleted successfully!");
        localStorage.clear();
        setTimeout(() => (window.location.href = "/"), 1500);
      }
    } catch {
      toast.error("Failed to delete account!");
    } finally {
      setShowDeletePopup(false);
    }
  };

  if (!profile)
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading Profile...</p>
      </div>
    );

  return (
    <div className="profile-wrapper">
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
      <div className="profile-card-container">
        <div className="profile-header">
          <div className="profile-pic-container">
            <img
              src={profile.profile_image_url}
              alt="Profile"
              className="profile-pic"
            />
          </div>
          <h2>{profile.FullName}</h2>
          <p className="email">{profile.Email}</p>
          <p className="bio">{profile.bio}</p>
        </div>

        {!isEditing ? (
          <div className="profile-info">
            <div className="info-grid">
              <div className="info-item">
                <Phone size={18} /> <span>Phone</span>
                <p>{profile.phone_number}</p>
              </div>
              <div className="info-item">
                <DollarSign size={18} /> <span>Monthly Income</span>
                <p>{formatNumber(profile.monthly_income)}</p>
              </div>
              <div className="info-item">
                <Target size={18} /> <span>Monthly Budget</span>
                <p>{formatNumber(profile.monthly_budget)}</p>
              </div>
              <div className="info-item">
                <DollarSign size={18} /> <span>Savings Goal</span>
                <p>{formatNumber(profile.savings_goal)}</p>
              </div>
            </div>

            <div className="button-group">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <Edit3 size={18} className="me-1" /> Edit Profile
              </button>
              <button
                className="delete-btn"
                onClick={() => setShowDeletePopup(true)}
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>
        ) : (
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="input-grid">
              <input
                type="text"
                name="phone_number"
                placeholder={`Phone: ${profile.phone_number}`}
                onChange={handleChange}
              />
              <input
                type="text"
                name="monthly_income"
                placeholder={`Income: ${profile.monthly_income}`}
                onChange={handleChange}
              />
              <input
                type="text"
                name="monthly_budget"
                placeholder={`Budget: ${profile.monthly_budget}`}
                onChange={handleChange}
              />
              <input
                type="text"
                name="savings_goal"
                placeholder={`Savings: ${profile.savings_goal}`}
                onChange={handleChange}
              />
              <label className="file-upload">
                <Upload size={16} /> Upload Profile Image
                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="button-row">
              <button type="submit" className="save-btn">
                <Save size={18} /> Save
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 🔥 Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Confirm Account Deletion</h4>
            <p>
              Are you sure you want to <strong>permanently delete</strong> your
              account? This action cannot be undone.
            </p>
            <div className="popup-buttons">
              <button className="confirm-btn" onClick={confirmDeleteUser}>
                Yes, Delete
              </button>
              <button
                className="cancel-popup-btn"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
