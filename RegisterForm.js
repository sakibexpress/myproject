import React, { useState } from "react";
import { auth } from "./firebase"; // Firebase Authentication সংযুক্ত
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./Auth.css"; // সুন্দর CSS এর জন্য (যদি ব্যবহার করেন)

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSuccess("✅ Registration Successful! Welcome, " + user.email);
      setEmail("");
      setPassword("");
    } catch (error) {
      setError("❌ Registration Failed: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>📝 Create an Account</h2>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <form onSubmit={handleRegister}>
        <input 
          type="email" 
          placeholder="Enter email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Enter password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button type="submit" className="register-btn">🚀 Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;
