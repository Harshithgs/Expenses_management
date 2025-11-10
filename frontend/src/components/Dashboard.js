import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  CalendarClock,
  CalendarRange,
  CalendarCheck2,
  WalletCards,
  CalendarDays,
  CalendarX2,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    AOS.init({ duration: 800, once: false, mirror: true });
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/summary/${user.id}`);
      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
        setCategoryData(data.by_category.overall || []);
        setPaymentData(
          (data.by_payment_mode.overall || []).map((item) => ({
            ...item,
            payment_mode: item.payment_mode === "BANK_TRANSFER" ? "Bank" : item.payment_mode,
          }))
        );

        setTrendData([
          { name: "Yesterday", value: data.summary.yesterday },
          { name: "Today", value: data.summary.today },
          { name: "This Week", value: data.summary.weekly },
          { name: "This Month", value: data.summary.monthly },
          { name: "This Year", value: data.summary.yearly },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#00bfff",
    "#007bff",
    "#6610f2",
    "#00c853",
    "#ff9800",
    "#e91e63",
    "#8bc34a",
    "#9c27b0",
    "#f44336",
    "#03a9f4",
  ];
  const roundValue = (val) => Math.round(val).toLocaleString();

  if (loading) {
    return (
      <div className="dashboard-loading text-center text-light py-5">
        <div className="spinner-border text-light" role="status"></div>
        <p className="mt-3">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card-container">
        <div className="dashboard-header" data-aos="fade-down">
          <h2 className="fw-bold display-6 text-center text-gradient">Expense Dashboard</h2>
          <p className="text-muted text-center mb-5">
            Visual insights into your personal spending
          </p>
        </div>

        {/* ===== Summary Cards ===== */}
        <div className="row g-4 mb-5">
          {[
            { label: "Yesterday", value: summary.yesterday, icon: <CalendarX2 /> },
            { label: "Today", value: summary.today, icon: <CalendarClock /> },
            { label: "This Week", value: summary.weekly, icon: <CalendarDays /> },
            { label: "This Month", value: summary.monthly, icon: <CalendarRange /> },
            { label: "This Year", value: summary.yearly, icon: <CalendarCheck2 /> },
            { label: "Total", value: summary.total, icon: <WalletCards /> },
          ].map((item, idx) => (
            <div className="col-md-4" key={idx} data-aos="zoom-in" data-aos-delay={idx * 100}>
              <div className="dashboard-info-card">
                <div className="dashboard-icon">{item.icon}</div>
                <h6 className="fw-semibold">{item.label}</h6>
                <h4 className="fw-bold text-gradient">₹{roundValue(item.value || 0)}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Category Charts (Pie + Bar Side by Side) ===== */}
        <div className="row g-4 mb-5">
          {/* Pie Chart */}
          <div className="col-lg-6" data-aos="fade-right">
            <div className="dashboard-chart-card">
              <h5 className="chart-title">Spending by Category (Pie)</h5>
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="total"
                      nameKey="category__name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${roundValue(value)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="col-lg-6" data-aos="fade-left">
            <div className="dashboard-chart-card">
              <h5 className="chart-title">Spending by Category (Bar)</h5>
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category__name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${roundValue(value)}`} />
                    <Bar dataKey="total" fill="#00bfff" barSize={45} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Payment and Trend Charts ===== */}
        <div className="row g-4">
          {/* Payment Mode Bar */}
          <div className="col-lg-6" data-aos="fade-right">
            <div className="dashboard-chart-card">
              <h5 className="chart-title">Spending by Payment Mode</h5>
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={paymentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="payment_mode" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${roundValue(value)}`} />
                    <Bar dataKey="total_amount" fill="#007bff" barSize={45} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Trend Line */}
          <div className="col-lg-6" data-aos="fade-left">
            <div className="dashboard-chart-card">
              <h5 className="chart-title">Spending Trend Overview</h5>
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${roundValue(value)}`} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00c853"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
