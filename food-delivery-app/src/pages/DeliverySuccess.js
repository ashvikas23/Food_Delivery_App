import React from "react";
import { Link } from "react-router-dom";
import "../style.css";

function DeliverySuccess() {
  return (
    <div className="success-page">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Your single delivery partner is collecting from multiple restaurants.</p>
      <Link to="/restaurants" className="back-home-btn">
        Back to Restaurants
      </Link>
    </div>
  );
}

export default DeliverySuccess;
