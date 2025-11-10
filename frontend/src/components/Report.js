import React, { useState } from "react";
import "../styles/Report.css";
import { Download, Loader2, FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Report = () => {
  const [loadingMap, setLoadingMap] = useState({});
  const userId = localStorage.getItem("user_id");

  const categories = [
    { id: null, name: "All Categories", icon: "📁" },
    { id: 5, name: "Entertainment", icon: "🎬" },
    { id: 9, name: "Other", icon: "✨" },
    { id: 10, name: "Food", icon: "🍔" },
    { id: 11, name: "Travel", icon: "✈️" },
    { id: 12, name: "Health", icon: "💊" },
    { id: 13, name: "Utilities", icon: "💡" },
    { id: 14, name: "Shopping", icon: "🛍️" },
    { id: 15, name: "Groceries", icon: "🛒" },
    { id: 16, name: "Education", icon: "📚" },
    { id: 17, name: "Rent", icon: "🏠" },
  ];

  const handleDownload = async (categoryId) => {
    const categoryName =
      categoryId === null
        ? "All_Categories"
        : categories.find((c) => c.id === categoryId)?.name || "Report";

    // mark this category as loading
    setLoadingMap((prev) => ({ ...prev, [categoryId]: true }));

    // fallback timeout reset after 30s
    const timeoutId = setTimeout(() => {
      setLoadingMap((prev) => ({ ...prev, [categoryId]: false }));
      toast.error(`⚠️ ${categoryName} report generation timed out.`);
    }, 30000);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/download-expense-report/${userId}/${
          categoryId ? `?category_id=${categoryId}` : ""
        }`
      );

      if (!response.ok) throw new Error("Failed to generate report");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${categoryName}_Expense_Report.pdf`;
      link.click();

      toast.success(`✅ ${categoryName} Report downloaded successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`❌ Failed to generate ${categoryName} report.`);
    } finally {
      clearTimeout(timeoutId);
      setLoadingMap((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  return (
    <div className="report-page">
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <h2 className="page-title">
        <FileText size={28} /> Expense Reports
      </h2>
      <p className="page-subtitle">
        Select a category below to generate and download its expense report.
      </p>

      <div className="report-cards">
        {categories.map((cat) => (
          <div key={cat.id ?? "all"} className="report-item">
            {/* Individual Title Above Card */}
            <h3 className="report-card-title">
              {cat.icon} {cat.name}
            </h3>
            <p className="report-desc">
              Generate a detailed report for <span>{cat.name}</span> expenses.
            </p>

            <button
              className={`download-btn ${
                loadingMap[cat.id] ? "loading" : ""
              }`}
              onClick={() => handleDownload(cat.id)}
              disabled={loadingMap[cat.id]}
            >
              {loadingMap[cat.id] ? (
                <>
                  <Loader2 size={18} className="spin" /> Generating...
                </>
              ) : (
                <>
                  <Download size={18} /> Download Report
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;
