import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { exportToCSV } from "./utils/exportToCSV";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function BuyerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("🚫 Please login to see requests!");
      return;
    }

    setLoading(true);
    const q = query(collection(db, "productRequests"), where("buyerId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (requests.length > 0 && data.length > requests.length) {
        toast.success("🛍️ New product request added!");
      }
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleExportCSV = () => {
    exportToCSV(requests, "buyer_requests.csv");
    toast.info("📥 CSV file downloaded!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Buyer Requests Report", 10, 10);
    let y = 20;

    requests.forEach((request, index) => {
      doc.text(`${index + 1}. ${request.name} - Status: ${request.status}`, 10, y);
      y += 10;
    });

    doc.save("buyer_requests.pdf");
    toast.info("📄 PDF file downloaded!");
  };

  return (
    <div className="col-md-12">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📌 Your Product Requests</h5>
          <input
            type="text"
            className="form-control form-control-sm w-50"
            placeholder="🔍 Search Requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : requests.length > 0 ? (
            <ul className="list-group">
              {requests
                .filter((request) => request.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((request) => (
                  <li key={request.id} className="list-group-item d-flex justify-content-between">
                    <span>{request.name}</span>
                    <span className={`badge bg-${request.status === "Accepted" ? "success" : "warning"}`}>
                      {request.status}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-muted text-center">😕 No matching requests found.</p>
          )}
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button className="btn btn-outline-primary" onClick={handleExportCSV}>📥 Export CSV</button>
          <button className="btn btn-outline-danger" onClick={handleExportPDF}>📄 Export PDF</button>
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
