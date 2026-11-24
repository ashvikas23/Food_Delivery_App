import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // get logged in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      setLoading(false);
      return;
    }

    const userId = storedUser.user_id; // important

    axios
      .get(`http://localhost:5000/api/orders/${userId}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

  }, []);

  return (
    <div className="admin-page">

      <h2>Your Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (

        orders.map(order => (

          <div key={order.order_id} className="admin-card">

            <h3>Order #{order.order_id}</h3>

            <p>
              <strong>Total:</strong> ₹{order.total_amount}
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Restaurant ID:</strong> {order.restaurant_id}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.order_time).toLocaleString("en-IN")}
            </p>

          </div>

        ))

      )}

    </div>
  );
}

export default ManageOrders;