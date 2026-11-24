import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "../style.css";

function Menu() {
  const { restaurant_id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart, decreaseQuantity } = useContext(CartContext);

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!restaurant_id) return;

    axios
      .get(`http://localhost:5000/menu/${restaurant_id}`)
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.log(err));
  }, [restaurant_id]);

  return (
    <div className="menu-page">
      <h1>Menu</h1>

      <div className="menu-grid">
        {menuItems.length === 0 ? (
          <p>No items available</p>
        ) : (
          menuItems.map((item) => {
            const cartItem = cart.find(
              (c) => c.item_id === item.item_id
            );

            return (
              <div className="menu-card" key={item.item_id}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>₹{item.price}</p>

                <div className="cart-controls">
                  {cartItem ? (
                    <>
                      <button
                        onClick={() => decreaseQuantity(item.item_id)}
                      >
                        -
                      </button>

                      <span>{cartItem.quantity}</span>

                      <button onClick={() => addToCart(item)}>
                        +
                      </button>
                    </>
                  ) : (
                    <button onClick={() => addToCart(item)}>
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* GO TO CART BUTTON */}
      {cart.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={() => navigate("/cart")}>
            Go To Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;