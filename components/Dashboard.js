import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { exportToCSV } from "./utils/exportToCSV";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [userType, setUserType] = useState("buyer");
  const [requests, setRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("🚫 Please login to access dashboard!");
      return;
    }

    setLoading(true);
    let unsubscribe = null;

    try {
      if (userType === "buyer") {
        const q = query(collection(db, "productRequests"), where("buyerId", "==", currentUser.uid));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setRequests(data);
          setLoading(false);
        });
      } else {
        const q = query(collection(db, "bids"), where("sellerId", "==", currentUser.uid));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setBids(data);
          setLoading(false);
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🚀 Your Professional Dashboard</h2>
      <button className="btn btn-secondary mb-3" onClick={() => setUserType(userType === "buyer" ? "seller" : "buyer")}>
        🔄 Switch to {userType === "buyer" ? "Seller" : "Buyer"}
      </button>
    </div>
  );
}

export default Dashboard;
