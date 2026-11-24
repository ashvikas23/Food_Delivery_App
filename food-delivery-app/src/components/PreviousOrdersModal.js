import React, { useEffect, useState } from "react";
import axios from "axios";

function PreviousOrdersModal({ userId, onClose }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/orders/${userId}`)
        .then((res) => {
          console.log("ORDERS:", res.data); // ✅ DEBUG
          setOrders(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [userId]);

  const handleReorder = (order) => {
    alert(`Reordering Order #${order.order_id}`);
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: "10px" }}>Your Orders</h2>

        <button onClick={onClose} style={closeBtn}>
          ✕
        </button>

        <hr />

        {orders.length === 0 ? (
          <p style={{ textAlign: "center" }}>No previous orders.</p>
        ) : (
          orders.map((order) => (
            <div key={order.order_id} style={card}>
              
              {/* HEADER */}
              <div style={header}>
                <div>
                  <strong style={{ fontSize: "16px" }}>
                    Order #{order.order_id || "N/A"}
                  </strong>

                  <p style={date}>
                    {order.order_time
                      ? new Date(order.order_time).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Recently placed"}
                  </p>
                </div>

                <span style={status}>
                  {order.status || "Placed"}
                </span>
              </div>

              {/* DIVIDER */}
              <div style={divider}></div>

              {/* ✅ FIXED DETAILS (FORCED DISPLAY) */}
              <div style={{ marginTop: "10px", fontSize: "14px", color: "#333" }}>
                <p>Order ID: #{order.order_id || "N/A"}</p>
                <p>
                  Restaurant ID:{" "}
                  {order.restaurant_id !== null &&
                  order.restaurant_id !== undefined
                    ? order.restaurant_id
                    : "N/A"}
                </p>
                <p>
                  Total Paid: ₹
                  {order.total_amount !== null &&
                  order.total_amount !== undefined
                    ? order.total_amount
                    : "0"}
                </p>
                <p>Payment: Cash on Delivery</p>
              </div>

              {/* ✅ DEBUG (UNCOMMENT IF NEEDED) */}
              {/* <p style={{ fontSize: "10px" }}>{JSON.stringify(order)}</p> */}

              {/* FOOTER */}
              <div style={footer}>
                <button
                  style={reorderBtn}
                  onClick={() => handleReorder(order)}
                >
                  Reorder
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "500px",
  maxHeight: "80vh",
  overflowY: "auto",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  right: "15px",
  top: "15px",
  background: "#e23744",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  borderRadius: "50%",
  cursor: "pointer",
};

const card = {
  border: "1px solid #eee",
  borderRadius: "10px",
  padding: "15px",
  marginBottom: "15px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const date = {
  fontSize: "12px",
  color: "gray",
};

const status = {
  background: "#e6f4ea",
  color: "green",
  padding: "4px 10px",
  borderRadius: "15px",
  fontSize: "12px",
};

const divider = {
  margin: "10px 0",
  borderBottom: "1px dashed #ccc",
};

const footer = {
  marginTop: "10px",
  display: "flex",
  justifyContent: "flex-end",
};

const reorderBtn = {
  padding: "8px 14px",
  backgroundColor: "#e23744",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default PreviousOrdersModal;