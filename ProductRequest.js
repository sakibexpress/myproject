import React, { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductRequest() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error("⚠️ আপনাকে লগইন করতে হবে!", { autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "product_requests"), {
        userId: auth.currentUser.uid,
        productName,
        description,
        budget,
        imageURL,
        createdAt: serverTimestamp(),
      });

      toast.success("✅ আপনার অনুরোধ সফলভাবে যুক্ত হয়েছে!", { autoClose: 3000 });

      // 2 সেকেন্ড পর রিডাইরেক্ট
      setTimeout(() => {
        navigate("/requests");
      }, 2000);
      
      // ফর্ম রিসেট
      setProductName("");
      setDescription("");
      setBudget("");
      setImageURL("");
    } catch (error) {
      toast.error("❌ অনুরোধ জমা দিতে সমস্যা হয়েছে!");
      console.error("প্রোডাক্ট রিকোয়েস্ট যুক্ত করতে সমস্যা হয়েছে:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-primary text-center">🛒 নতুন পণ্য অনুরোধ করুন</h2>
        
        {/* 🖼️ লাইভ ইমেজ প্রিভিউ */}
        {imageURL && (
          <div className="text-center my-3">
            <img src={imageURL} alt="Product Preview" className="img-fluid rounded shadow" style={{ maxWidth: "250px", height: "auto" }} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">পণ্যের নাম:</label>
            <input 
              type="text" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              className="form-control" 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">বিবরণ:</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="form-control" 
              rows="3"
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">বাজেট (৳):</label>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)} 
              className="form-control" 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">🖼️ পণ্যের ছবি URL:</label>
            <input 
              type="text" 
              value={imageURL} 
              onChange={(e) => setImageURL(e.target.value)} 
              className="form-control" 
            />
          </div>

          {/* 📩 লোডিং ইফেক্ট সহ সাবমিট বাটন */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "⏳ অনুরোধ পাঠানো হচ্ছে..." : "📩 অনুরোধ করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductRequest;
