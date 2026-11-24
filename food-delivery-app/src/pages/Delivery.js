import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

function Delivery() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");

  const handleContinue = () => {
    if (!address || !city || !pincode) {
      alert("Please fill all required fields");
      return;
    }

    // Save delivery details in localStorage
    localStorage.setItem(
      "deliveryDetails",
      JSON.stringify({ address, city, pincode, landmark })
    );

    navigate("/payment");
  };

  return (
    <div className="delivery-page">
      <h1>Delivery Details</h1>

      <div className="delivery-form">
        <input
          type="text"
          placeholder="Flat / House No / Street"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />

        <input
          type="text"
          placeholder="Landmark (Optional)"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />

        <button className="continue-btn" onClick={handleContinue}>
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

export default Delivery;
