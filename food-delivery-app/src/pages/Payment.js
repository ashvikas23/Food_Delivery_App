import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style.css";

function Payment() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryDetails = JSON.parse(localStorage.getItem("deliveryDetails"));

  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/orders", {
        user_id: 1,
        total_amount: totalAmount,
        items: cart,
        delivery_details: deliveryDetails,
        payment_method: paymentMethod,
      });

      // ✅ save order for receipt page
      localStorage.setItem(
        "latestOrder",
        JSON.stringify({
          items: cart,
          total: totalAmount,
          delivery: deliveryDetails,
          payment: paymentMethod,
        })
      );

      clearCart();

      navigate("/receipt"); // ✅ go to new page
    } catch (err) {
      console.log(err);
      alert("Payment Failed");
    }
  };

  return (
    <div className="payment-page">
      <h1>Payment</h1>

      <h3>Total Amount: ₹{totalAmount}</h3>

      <div className="payment-options">
        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="radio"
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>

        <label>
          <input
            type="radio"
            value="Card"
            checked={paymentMethod === "Card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Card
        </label>
      </div>

      <button className="pay-btn" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
}

export default Payment;