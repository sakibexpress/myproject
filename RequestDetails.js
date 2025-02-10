import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import BidForm from "./BidForm";

function RequestDetails() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchRequestAndBids = async () => {
      if (!auth.currentUser) {
        console.error("User not logged in");
        return;
      }

      try {
        // **প্রোডাক্ট রিকোয়েস্ট ডাটা লোড করুন**
        const requestDoc = await getDoc(doc(db, "product_requests", requestId));
        if (requestDoc.exists()) {
          const requestData = { id: requestDoc.id, ...requestDoc.data() };
          setRequest(requestData);

          // **এই রিকোয়েস্টটি বর্তমান ইউজারের কিনা চেক করুন**
          if (auth.currentUser.uid === requestData.userId) {
            setIsOwner(true);
          }

          // **শুধুমাত্র রিকোয়েস্টের মালিক সব বিড দেখতে পারবে**
          const q = query(collection(db, "bids"), where("requestId", "==", requestId));
          const querySnapshot = await getDocs(q);
          setBids(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } else {
          console.error("Request not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setLoading(false);
    };

    fetchRequestAndBids();
  }, [requestId]);

  if (loading) return <p>⏳ লোড হচ্ছে...</p>;

  return (
    <div className="container mt-5">
      {request ? (
        <div className="card shadow-sm p-4">
          <h2 className="text-primary">🛍️ {request.productName}</h2>
          <p><strong>📝 বিবরণ:</strong> {request.description}</p>
          <p><strong>💰 বাজেট:</strong> ৳{request.budget}</p>
          {request.imageURL && <img src={request.imageURL} alt={request.productName} width="100%" className="rounded" />}

          {/* Bid Form */}
          <BidForm requestId={request.id} buyerId={request.userId} />

          {isOwner && (
            <div className="mt-4">
              <h3>📩 আপনার জন্য দেয়া প্রস্তাবিত দাম</h3>
              <ul className="list-group">
                {bids.length > 0 ? (
                  bids.map((bid) => (
                    <li key={bid.id} className="list-group-item">
                      <strong>💰 ৳{bid.bidAmount}</strong> - {bid.message}
                    </li>
                  ))
                ) : (
                  <p className="text-muted">🚫 এখনো কোনো প্রস্তাব দেয়া হয়নি!</p>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="text-danger">❌ পণ্য রিকোয়েস্ট পাওয়া যায়নি!</p>
      )}
    </div>
  );
}

export default RequestDetails;
