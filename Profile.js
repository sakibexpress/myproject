import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setDisplayName(currentUser.displayName || "");
          setPhotoURL(currentUser.photoURL || "");

          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } else {
          navigate("/login"); // ইউজার লগইন না থাকলে লগইন পেজে পাঠানো হবে
        }
        setLoading(false);
      });
    };

    fetchUserData();
  }, [navigate]);

  // **🔥 ইউজারের নাম এবং ছবি আপডেট ফাংশন**
  const handleUpdateProfile = async () => {
    if (user) {
      try {
        // Firebase Authentication-এ নাম এবং প্রোফাইল ছবি আপডেট
        await updateProfile(user, {
          displayName,
          photoURL,
        });

        // Firestore-এ ইউজারের তথ্য আপডেট
        await updateDoc(doc(db, "users", user.uid), {
          displayName,
          photoURL,
        });

        alert("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      } catch (error) {
        console.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে:", error);
      }
    }
  };

  if (loading) return <p>লোড হচ্ছে...</p>;

  return (
    <div>
      <h2>👤 ইউজার প্রোফাইল</h2>
      {user ? (
        <div>
          <img
            src={photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            width="150"
            style={{ borderRadius: "50%" }}
          />
          <h3>নাম: {user.displayName || "নাম নেই"}</h3>
          <p>📩 ইমেইল: {user.email}</p>

          {userData && (
            <p>🔹 নিবন্ধন তারিখ: {userData.createdAt?.toDate().toLocaleString()}</p>
          )}

          {/* 🔥 নাম এবং প্রোফাইল ছবি আপডেট ফর্ম */}
          <div>
            <h3>⚙️ প্রোফাইল আপডেট করুন</h3>
            <label>
              নাম:
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
            <br />
            <label>
              প্রোফাইল ছবি URL:
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </label>
            <br />
            <button onClick={handleUpdateProfile}>🔄 আপডেট করুন</button>
          </div>
        </div>
      ) : (
        <p>আপনি লগইন করেননি!</p>
      )}
    </div>
  );
}

export default Profile;
