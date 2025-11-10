import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  FiEdit,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import "../styles/ManageExpense.css";

const categories = [
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
];

const ManageExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [categoryGraphs, setCategoryGraphs] = useState({});
  const [showGraph, setShowGraph] = useState({});
  const [editExpense, setEditExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    payment_mode: "",
    note: "",
    expense_date: "",
  });

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) return;
    fetchExpenses();
  }, [userId]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/getexpense/${userId}/`);
      if (res.data && res.data.expenses) {
        const recent = res.data.expenses.slice(-10).reverse();
        setExpenses(recent);
        groupExpensesByCategory(res.data.expenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const groupExpensesByCategory = (data) => {
    const grouped = {};
    data.forEach((exp) => {
      const cat = exp.category.name;
      const date = new Date(exp.expense_date);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const key = `${cat}-${year}`;
      if (!grouped[key]) grouped[key] = {};
      grouped[key][month] = (grouped[key][month] || 0) + parseFloat(exp.amount);
    });
    setCategoryGraphs(grouped);
  };

  const handleEditClick = (expense) => {
    setEditExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category.name,
      payment_mode: expense.payment_mode,
      note: expense.note,
      expense_date: expense.expense_date,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/editexpense/", {
        userId: parseInt(userId),
        expenseId: editExpense.id,
        ...formData,
      });
      setEditExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const calculateDifference = (data) => {
    const months = Object.keys(data);
    const diffs = [];
    for (let i = 1; i < months.length; i++) {
      const diff = data[months[i]] - data[months[i - 1]];
      const msg = {
        text: `You spent ₹${Math.abs(diff).toFixed(2)} ${diff > 0 ? "more" : "less"} in ${months[i]} than in ${months[i - 1]}.`,
        increase: diff > 0,
      };
      diffs.push(msg);
    }
    return diffs;
  };

  return (
    <div className="manage-expense-container">
        
      <h2 className="page-title"><center> Manage Expenses</center></h2>

      <div className="expense-list full-width">
        {expenses.map((exp) => (
          <div key={exp.id} className="expense-card full-width-card">
            <div className="expense-info">
              <h4>{exp.title}</h4>
              <p>₹{exp.amount}</p>
              <p>{exp.category.name}</p>
              <p>{exp.expense_date}</p>
            </div>
            <div className="action-icons right-align">
              <FiEdit className="icon edit" onClick={() => handleEditClick(exp)} />
            </div>
          </div>
        ))}
      </div>

      {editExpense && (
        <div className="edit-modal">
          <form onSubmit={handleUpdate}>
            <h3>Edit Expense</h3>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="button-row">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setEditExpense(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <h2 className="graph-section-title">Expense Comparison by Category</h2>

      {Object.entries(categoryGraphs).map(([key, data]) => {
        const [cat, year] = key.split("-");
        const formattedData = Object.keys(data).map((month) => ({
          month,
          amount: data[month],
        }));
        const diffs = calculateDifference(data);

        return (
          <div key={key} className="category-graph card">
            <h3 className="category-title">{cat} - {year}</h3>
            <ul className="difference-list spaced">
              {diffs.map((d, i) => (
                <li key={i}>
                  {d.increase ? (
                    <FiTrendingUp className="trend-icon up" />
                  ) : (
                    <FiTrendingDown className="trend-icon down" />
                  )}
                  {d.text}
                </li>
              ))}
            </ul>
            <div className="graph-toggle-container">
              <button
                className="view-graph-btn"
                onClick={() => setShowGraph({ ...showGraph, [key]: !showGraph[key] })}
              >
                {showGraph[key] ? "Hide Graph ▲" : "View Graph ▼"}
              </button>
            </div>

            <div
              className={`graph-wrapper ${
                showGraph[key] ? "graph-visible" : "graph-hidden"
              }`}
            >
              {showGraph[key] && (
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v) => [`₹${v}`, "Amount"]} />
                    <Legend />
                    <Bar dataKey="amount" fill="#1976D2" barSize={55} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManageExpense;
