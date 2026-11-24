import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../style.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();   // 🔥 VERY IMPORTANT

    axios.post("http://localhost:5000/signup", formData)
      .then((res) => {
        alert(res.data.message);

        if (res.data.message === "Signup successful") {
          navigate("/login");  // redirect after success
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Signup failed");
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up</h2>

        <form className="auth-form" onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
