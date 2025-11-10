import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CreditCard,
  Calendar,
  Tag,
  FileText,
  CheckCircle,
  PlusCircle,
  Wallet,
} from "lucide-react";
import "../styles/AddExpense.css";

const AddExpense = () => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    payment_mode: "",
    note: "",
    expense_date: "",
  });

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // ✅ Get user info safely
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || localStorage.getItem("user_id");

  // ✅ Default categories
  const [categories, setCategories] = useState([
    { id: 5, name: "Entertainment" },
    { id: 9, name: "Other" },
    { id: 10, name: "Food" },
    { id: 11, name: "Travel" },
    { id: 12, name: "Health" },
    { id: 13, name: "Utilities" },
    { id: 14, name: "Shopping" },
    { id: 15, name: "Groceries" },
    { id: 16, name: "Education" },
    { id: 17, name: "Rent" },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit Expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not found! Please log in again.");
      return;
    }

    let categoryName = form.category;

    // ✅ If user is adding a new category
    if (isAddingNewCategory && newCategory.trim()) {
      const trimmed = newCategory.trim();
      setCategories([...categories, { id: Date.now(), name: trimmed }]);
      categoryName = trimmed;
    } else {
      // ✅ Convert selected category ID to name
      const selectedCat = categories.find(
        (c) => c.id === parseInt(form.category)
      );
      categoryName = selectedCat ? selectedCat.name : form.category;
    }

    // ✅ Prepare data for API
    const expenseData = {
      userId: userId,
      title: form.title,
      amount: parseFloat(form.amount),
      category: categoryName, // ← Send category NAME now
      payment_mode: form.payment_mode,
      note: form.note,
      expense_date: form.expense_date,
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/expense/", expenseData);
      if (res.status === 200 || res.status === 201) {
        toast.success("✅ Expense added successfully!");
        setForm({
          title: "",
          amount: "",
          category: "",
          payment_mode: "",
          note: "",
          expense_date: "",
        });
        setNewCategory("");
        setIsAddingNewCategory(false);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("❌ Failed to add expense. Try again!");
    }
  };

  return (
    <div className="add-expense-container py-5">
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <div className="container">
        <div className="card add-expense-card p-4 shadow-lg rounded-4 border-0">
          <h3 className="text-center text-primary fw-bold mb-4">
            <CheckCircle className="me-2" /> Add New Expense
          </h3>

          <form onSubmit={handleSubmit} className="row g-4">
            {/* Title */}
            <div className="col-md-6">
              <label className="form-label unified-label">
                <Tag size={16} className="me-1" /> Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="form-control unified-input"
                placeholder="Title of the expense"
                required
              />
            </div>

            {/* Amount */}
            <div className="col-md-6">
              <label className="form-label unified-label">
                <Wallet size={16} className="me-1" /> Amount
              </label>
              <input
                type="text"
                name="amount"
                value={
                  form.amount
                    ? form.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  if (!isNaN(rawValue)) {
                    setForm({ ...form, amount: rawValue });
                  }
                }}
                className="form-control unified-input"
                placeholder="Amount of the expense"
                required
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label unified-label">
                <Tag size={16} className="me-1" /> Category
              </label>
              {!isAddingNewCategory ? (
                <div className="d-flex gap-2">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="form-select unified-input"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-3"
                    onClick={() => setIsAddingNewCategory(true)}
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="form-control unified-input"
                    placeholder="Enter new category"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger rounded-3"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setNewCategory("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Payment Mode */}
            <div className="col-md-6">
              <label className="form-label unified-label">
                <CreditCard size={16} className="me-1" /> Payment Mode
              </label>
              <select
                name="payment_mode"
                value={form.payment_mode}
                onChange={handleChange}
                className="form-select unified-input"
                required
              >
                <option value="">Select Payment Mode</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="NETBANKING">Net Banking</option>
              </select>
            </div>

            {/* Expense Date */}
            <div className="col-md-6">
              <label className="form-label unified-label">
                <Calendar size={16} className="me-1" /> Expense Date
              </label>
              <input
                type="date"
                name="expense_date"
                value={form.expense_date}
                onChange={handleChange}
                className="form-control unified-input"
                required
              />
            </div>

            {/* Note */}
            <div className="col-md-6">
              <label className="form-label unified-label">
                <FileText size={16} className="me-1" /> Note
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                className="form-control unified-input"
                placeholder="Optional note about this expense"
                rows="2"
              ></textarea>
            </div>

            <div className="col-12 text-center">
              <button
                type="submit"
                className="btn btn-primary px-5 py-2 fw-semibold rounded-4"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
