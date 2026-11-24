// ProfileDropdown.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfileDropdown({ userId }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [orders, setOrders] = useState([]);

  // Fetch previous orders
  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/orders/${userId}`) // your backend API to get orders by user
        .then((res) => setOrders(res.data))
        .catch((err) => console.log(err));
    }
  }, [userId]);

  return (
    <div className="profile-dropdown-container" style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="profile-btn"
      >
        Profile
      </button>

      {showDropdown && (
        <div
          className="dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "250px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          <h4 style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
            Previous Orders
          </h4>
          {orders.length === 0 ? (
            <p style={{ padding: "10px" }}>No previous orders.</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {orders.map((order) => (
                <li
                  key={order.id}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Order #{order.id}</span>
                  <span
                    style={{
                      color:
                        order.status === "Delivered"
                          ? "green"
                          : order.status === "Pending"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;