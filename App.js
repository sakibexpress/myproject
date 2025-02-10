import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import ProductRequest from "./ProductRequest";
import RequestList from "./RequestList";
import Auth from "./Auth";
import ProtectedRoute from "./ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Dark Mode Check
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

  return (
    <Router>
      <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">🛍️ My Marketplace</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/requests">Requests</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/product-request">Add Request</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                {user ? (
                  <>
                    <li className="nav-item"><span className="nav-link text-white">👤 {user.displayName}</span></li>
                    <li className="nav-item"><button className="btn btn-warning ms-3" onClick={() => auth.signOut()}>Logout</button></li>
                  </>
                ) : (
                  <li className="nav-item"><Link className="btn btn-success ms-3" to="/login">Login</Link></li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow-1">
          <div className="container my-5">
            <h1 className="text-center text-primary fw-bold mb-4">🎨 Welcome to My React App!</h1>
            <div className="text-center">
              <button className="btn btn-secondary" onClick={toggleTheme}>
                {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/product-request" element={<ProtectedRoute><ProductRequest /></ProtectedRoute>} />
              <Route path="/requests" element={<RequestList />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-light py-3 mt-auto">
          <div className="container text-center">
            <p className="mb-0">© {new Date().getFullYear()} My Marketplace. All Rights Reserved.</p>
          </div>
        </footer>

        {/* Toast Notification */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
}

export default App;
