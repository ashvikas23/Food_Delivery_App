// Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PreviousOrdersModal from "./PreviousOrdersModal"; // ✅ only once
import "../style.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const navigate = useNavigate();

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); // ✅ also clear this
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <nav className="navbar" style={{ padding: "10px 20px", background: "#d32323" }}>
      <div className="logo">
        <Link to="/" style={{ color: "#fff", fontWeight: "bold", fontSize: "24px" }}>
          FoodDelivery
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/" style={{ color: "#fff" }}>Home</Link></li>

        {!user ? (
          <>
            <li><Link to="/login" style={{ color: "#fff" }}>Login</Link></li>
            <li><Link to="/signup" style={{ color: "#fff" }}>Signup</Link></li>
          </>
        ) : (
          <>
            <li style={{ position: "relative" }}>
              <div
                className="profile-circle"
                onClick={() => setShowProfile(!showProfile)}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              {showProfile && (
                <div
                  className="profile-dropdown"
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    width: "200px",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "10px",
                    zIndex: 100,
                  }}
                >
                  <p><strong>{user.name}</strong></p>
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
                  <hr />
                  <span
                    style={{
                      display: "block",
                      marginTop: "5px",
                      color: "#d32323",
                      cursor: "pointer"
                    }}
                    onClick={() => setShowOrdersModal(true)}
                  >
                    View Previous Orders
                  </span>
                </div>
              )}
            </li>

            <li>
              <span
                className="nav-link"
                onClick={handleLogout}
                style={{ cursor: "pointer", color: "#fff" }}
              >
                Logout
              </span>
            </li>
          </>
        )}
      </ul>

      {/* ✅ FIXED HERE */}
      {showOrdersModal && user && (
        <PreviousOrdersModal
          userId={user.user_id}   // 🔥 FIXED
          onClose={() => setShowOrdersModal(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;