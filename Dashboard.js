import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { exportToCSV } from "./utils/exportToCSV";
import { jsPDF } from "jspdf";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

function Dashboard() {
  const [userType, setUserType] = useState("buyer");
  const [requests, setRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    setLoading(true);

    let unsubscribe = null;
    try {
      if (userType === "buyer") {
        const q = query(collection(db, "productRequests"), where("buyerId", "==", auth.currentUser.uid));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setRequests(data);
          setLoading(false);
          toast.info("New request added!", { autoClose: 3000 });
        });
      } else {
        const q = query(collection(db, "bids"), where("sellerId", "==", auth.currentUser.uid));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setBids(data);
          setLoading(false);
          toast.success("New bid received!", { autoClose: 3000 });
        });
      }
    } catch (error) {
      console.error("Error fetching real-time data:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userType]);

  const handleExportCSV = () => {
    const data = userType === "buyer" ? requests : bids;
    exportToCSV(data, `${userType}_data.csv`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("User Data Report", 10, 10);
    const data = userType === "buyer" ? requests : bids;
    let y = 20;
    data.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name || item.productName} - ${item.status || item.amount}`, 10, y);
      y += 10;
    });
    doc.save(`${userType}_data.pdf`);
  };

  const renderCharts = () => {
    return (
      <div className="mt-5">
        <h4 className="text-center">📊 Data Analytics</h4>

        <div className="row">
          {/* Buyer Requests - Pie Chart */}
          <div className="col-md-4">
            <h5 className="text-center">Buyer Requests</h5>
            <PieChart width={300} height={300}>
              <Pie
                data={requests}
                dataKey="status"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              />
            </PieChart>
          </div>

          {/* Seller Bids - Bar Chart */}
          <div className="col-md-4">
            <h5 className="text-center">Seller Bids</h5>
            <BarChart width={300} height={300} data={bids}>
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </div>

          {/* Requests Over Time - Line Chart */}
          <div className="col-md-4">
            <h5 className="text-center">Requests Over Time</h5>
            <LineChart width={300} height={300} data={requests}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="status" stroke="#ff7300" />
            </LineChart>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
      <div className="d-flex">
        {/* Sidebar */}
        <div className="bg-primary text-white p-4 min-vh-100" style={{ width: "250px" }}>
          <h4>📊 Dashboard</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button className="btn btn-outline-light w-100 my-2" onClick={() => setUserType("buyer")}>
                Buyer Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light w-100 my-2" onClick={() => setUserType("seller")}>
                Seller Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-warning w-100 my-2" onClick={toggleTheme}>
                {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
              </button>
            </li>
          </ul>
        </div>

        {/* Main Dashboard */}
        <div className="container mt-4 flex-grow-1">
          <h2 className="text-center mb-4">🚀 Your {userType === "buyer" ? "Buyer" : "Seller"} Dashboard</h2>

          {/* Chart Section */}
          {renderCharts()}

          {/* Export Buttons */}
          <div className="text-center mt-4">
            <button className="btn btn-outline-primary me-2" onClick={handleExportCSV}>📥 Export CSV</button>
            <button className="btn btn-outline-danger" onClick={handleExportPDF}>📄 Export PDF</button>
          </div>

          {/* Toast Notification */}
          <div className="text-center">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
