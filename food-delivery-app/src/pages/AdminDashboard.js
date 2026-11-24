import React from "react";
import { Link } from "react-router-dom";
import "../style.css";

function AdminDashboard() {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-grid">
        <Link to="/admin/restaurants" className="admin-card">
          Manage Restaurants
        </Link>

        <Link to="/admin/menu" className="admin-card">
          Manage Menu
        </Link>

        <Link to="/admin/orders" className="admin-card">
          View Orders
        </Link>

        <Link to="/admin/users" className="admin-card">
          Manage Users
        </Link>

        <Link to="/admin/delivery" className="admin-card">
          Delivery Partners
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
