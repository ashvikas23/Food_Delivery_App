import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartBar.css";

function CartBar() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Hide if cart empty
  if (totalItems === 0) return null;

  return (
    <div className="cart-bar" onClick={() => navigate("/cart")}>
      <div className="cart-info">
        <span>{totalItems} item{totalItems > 1 ? "s" : ""}</span>
        <span>₹{totalPrice}</span>
      </div>

      <button className="view-cart-btn">
        View Cart →
      </button>
    </div>
  );
}

export default CartBar;