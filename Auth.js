import React, { useState, useEffect } from "react";
import { auth, googleProvider, db, collection, addDoc } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });
    return () => unsubscribe();
  }, []);

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setError("❌ Invalid Email Format!");
      return;
    }

    if (password.length < 6) {
      setError("❌ Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await sendEmailVerification(newUser);
      await addDoc(collection(db, "users"), {
        uid: newUser.uid,
        email: newUser.email,
        createdAt: new Date(),
      });

      toast.success("✅ Registration Successful! Please verify your email.");
      setError("");
    } catch (error) {
      setError("❌ Signup Failed: " + error.message);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setError("❌ Invalid Email Format!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("✅ Login Successful!");
      setError("");
    } catch (error) {
      setError("❌ Login Failed: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const newUser = userCredential.user;

      await addDoc(collection(db, "users"), {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        photoURL: newUser.photoURL,
        createdAt: new Date(),
      });

      toast.success("✅ Google Login Successful!");
      setError("");
    } catch (error) {
      setError("❌ Google Login Failed: " + error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("❌ Enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.info("📩 Password reset link sent to email!");
    } catch (error) {
      setError("❌ Failed to send reset email.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
    toast.warning("⚠️ Logged Out!");
  };

  return (
    <div className={darkMode ? "auth-container dark-mode" : "auth-container"}>
      <ToastContainer position="top-right" autoClose={3000} />

      <button className="btn-toggle-theme" onClick={toggleTheme}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      {user ? (
        <div className="user-info">
          <h2>👋 Welcome, {user.displayName || user.email}!</h2>
          <button className="btn-logout" onClick={handleLogout}>
            🔓 Logout
          </button>
        </div>
      ) : (
        <div className="auth-box">
          <h2>🔑 {isLogin ? "Login" : "Sign Up"}</h2>
          {error && <p className="error">{error}</p>}

          <input type="email" placeholder="📩 Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="🔑 Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {!isLogin && <input type="password" placeholder="🔑 Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />}

          {isLogin ? (
            <>
              <button className="btn-auth" onClick={handleLogin}>🚀 Login</button>
              <button className="btn-google" onClick={handleGoogleLogin}>🔵 Login with Google</button>
              <p onClick={handleForgotPassword} className="forgot-password">🔑 Forgot Password?</p>
              <p onClick={() => setIsLogin(false)} className="toggle-text">Don't have an account? Register</p>
            </>
          ) : (
            <>
              <button className="btn-auth" onClick={handleSignup}>📩 Register</button>
              <button className="btn-google" onClick={handleGoogleLogin}>🔵 Sign Up with Google</button>
              <p onClick={() => setIsLogin(true)} className="toggle-text">Already have an account? Login</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Auth;
