import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase"; // Firebase Auth সংযুক্ত

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup function
  }, []);

  if (loading) return <p>Loading...</p>; // ইউজার ডাটা লোড হওয়ার আগে লোডিং দেখাবে

  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

