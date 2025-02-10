import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "./firebase";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "product_requests"));
        const requestList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRequests(requestList);
      } catch (error) {
        console.error("❌ প্রোডাক্ট রিকোয়েস্ট লোড করতে সমস্যা হয়েছে:", error);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-primary text-center my-4">📋 প্রোডাক্ট অনুরোধের তালিকা</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">লোড হচ্ছে...</span>
          </div>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-center text-muted">🚫 এখনো কোনো প্রোডাক্ট রিকোয়েস্ট নেই!</p>
      ) : (
        <div className="row">
          {requests.map(request => (
            <div className="col-md-4 col-sm-6 mb-4" key={request.id}>
              <div className="card shadow-sm border-0">
                {request.imageURL && (
                  <img 
                    src={request.imageURL} 
                    className="card-img-top img-fluid" 
                    alt={request.productName}
                    style={{ height: "200px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{request.productName}</h5>
                  <p className="card-text text-muted">{request.description.substring(0, 80)}...</p>
                  <p><strong>💰 বাজেট:</strong> <span className="text-success">৳{request.budget}</span></p>
                  <Link to={`/request/${request.id}`} className="btn btn-primary w-100">🔍 বিস্তারিত দেখুন</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestList;
