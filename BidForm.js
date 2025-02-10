import React, { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

function BidForm({ requestId, buyerId }) {
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("⚠️ আপনাকে লগইন করতে হবে!");
      return;
    }

    if (bidAmount <= 0) {
      alert("⚠️ প্রস্তাবিত মূল্য সঠিকভাবে লিখুন!");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "bids"), {
        requestId,
        buyerId,
        sellerId: auth.currentUser.uid,
        bidAmount,
        message,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage("✅ আপনার প্রস্তাব সফলভাবে পাঠানো হয়েছে!");
      setBidAmount("");
      setMessage("");
    } catch (error) {
      console.error("❌ বিড পাঠাতে সমস্যা হয়েছে:", error);
      alert("❌ বিড পাঠাতে সমস্যা হয়েছে!");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-center text-primary">⚡ বিক্রেতার দাম প্রস্তাব করুন</h3>
        
        {successMessage && (
          <div className="alert alert-success text-center">{successMessage}</div>
        )}

        <form onSubmit={handleBidSubmit}>
          {/* 💰 প্রস্তাবিত মূল্য */}
          <div className="mb-3">
            <label className="form-label">💰 প্রস্তাবিত মূল্য (৳):</label>
            <input
              type="number"
              className="form-control"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
          </div>

          {/* ✉️ বার্তা */}
          <div className="mb-3">
            <label className="form-label">✉️ বার্তা:</label>
            <textarea
              className="form-control"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {/* ✅ সাবমিট বাটন */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "⏳ পাঠানো হচ্ছে..." : "📩 প্রস্তাব পাঠান"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BidForm;
