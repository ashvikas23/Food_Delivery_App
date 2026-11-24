import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../style.css";

function Cart() {
  const { cart, addToCart, decreaseQuantity, removeFromCart } =
    useContext(CartContext);

  const navigate = useNavigate(); // ✅ Correct place

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.item_id}>
              <img
                src={`http://localhost:5000/images/${item.image}`}
                alt={item.name}
              />

              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.item_id)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => addToCart(item)}>+</button>
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.item_id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="cart-summary">
            <h2>Total: ₹{totalAmount}</h2>

            <button
  className="place-order-btn"
  onClick={() => navigate("/delivery")}
>
  Proceed
</button>

          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
