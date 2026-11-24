import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../style.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (res.data.success) {
        const user = res.data.user;

        // ✅ Save full user
        localStorage.setItem("user", JSON.stringify(user));

        // 🔥 IMPORTANT FIX (THIS WAS MISSING)
        localStorage.setItem("userId", user.user_id);

        // 🔄 Update Navbar instantly
        window.dispatchEvent(new Event("storage"));

        // ✅ Redirect based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/restaurants");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Not registered yet? <Link to="/signup">Signup now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;