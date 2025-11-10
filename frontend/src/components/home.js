import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { PieChart, BarChart3, Wallet, CalendarDays, ArrowRight } from "lucide-react";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,   // 👈 Repeats animation every time you scroll
      mirror: true,  // 👈 Animates again when scrolling up
      offset: 120,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="home bg-light">
      {/* Hero Section */}
      <section className="text-center py-5 bg-primary text-light">
        <div className="container" data-aos="zoom-in">
          <h1 className="fw-bold display-5 mb-3">Smart Expense Management</h1>
          <p className="lead mb-4">
            Track your daily, monthly, and yearly expenses with insightful analytics and reports.
          </p>
          <a href="/signup" className="btn btn-light btn-lg fw-semibold shadow-sm">
            Get Started <ArrowRight size={20} className="ms-2" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold text-primary" data-aos="fade-down">
            What You Can Do
          </h2>
          <div className="row g-4">
            
            {/* Card 1 - Expense Entry */}
            <div className="col-md-4" data-aos="fade-up">
              <div className="card border-0 shadow-lg h-100 text-center p-3 rounded-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4299/4299911.png"
                  alt="Expense Entry"
                  className="card-img-top mx-auto mt-3"
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="card-body">
                  <h5 className="fw-semibold mb-2 text-primary">Add Your Expenses</h5>
                  <p className="text-muted">
                    Easily record your daily expenses with category and amount tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Analytics */}
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="150">
              <div className="card border-0 shadow-lg h-100 text-center p-3 rounded-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4149/4149670.png"
                  alt="Analytics"
                  className="card-img-top mx-auto mt-3"
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="card-body">
                  <h5 className="fw-semibold mb-2 text-success">Visual Analytics</h5>
                  <p className="text-muted">
                    Get beautiful charts and graphs to analyze your spending trends over time.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Reports */}
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card border-0 shadow-lg h-100 text-center p-3 rounded-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4961/4961932.png"
                  alt="Reports"
                  className="card-img-top mx-auto mt-3"
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="card-body">
                  <h5 className="fw-semibold mb-2 text-info">Reports & Insights</h5>
                  <p className="text-muted">
                    Download monthly or yearly reports to plan budgets and control expenses.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5 bg-white border-top">
        <div className="container text-center" data-aos="fade-up">
          <h2 className="fw-bold mb-4 text-primary">About Expense Tracker</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Our platform helps you take full control of your finances. 
            Whether you're managing personal expenses or small business costs, 
            our dashboard provides clear insights with interactive graphs and smart analysis tools.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-light text-center">
        <div className="container" data-aos="zoom-in">
          <h2 className="fw-bold mb-3">Ready to Manage Your Expenses Smartly?</h2>
          <a href="/signup" className="btn btn-light btn-lg fw-semibold">
            Join Now <ArrowRight size={20} className="ms-2" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
