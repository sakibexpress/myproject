import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <div className="container text-center mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* Logo */}
          <div className="mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
              alt="Logo" 
              width="100"
            />
          </div>

          {/* Welcome Text */}
          <h2 className="fw-bold text-primary">🏡 স্বাগতম আমাদের প্ল্যাটফর্মে!</h2>
          <p className="text-muted">আপনার প্রয়োজনীয় প্রোডাক্ট অনুরোধ করুন, বিড করুন এবং সহজেই কেনাকাটা করুন।</p>

          {/* Login & Signup Buttons */}
          <div className="d-grid gap-2">
            <Link to="/login" className="btn btn-primary btn-lg">🔑 লগইন করুন</Link>
            <Link to="/register" className="btn btn-outline-success btn-lg">📝 নতুন অ্যাকাউন্ট তৈরি করুন</Link>
          </div>

          {/* Features List */}
          <div className="mt-4">
            <h5 className="fw-bold text-secondary">🚀 আমাদের ফিচারসমূহ</h5>
            <ul className="list-group text-start">
              <li className="list-group-item">✔️ সহজেই পণ্য অনুরোধ করুন</li>
              <li className="list-group-item">✔️ বিক্রেতাদের থেকে বিড গ্রহণ করুন</li>
              <li className="list-group-item">✔️ প্রিমিয়াম ড্যাশবোর্ড এনালিটিক্স</li>
              <li className="list-group-item">✔️ রিয়েল-টাইম লাইভ নোটিফিকেশন</li>
              <li className="list-group-item">✔️ নিরাপদ লেনদেন ও প্রোডাক্ট ট্র্যাকিং</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
