import React, { useState, useEffect } from "react";
import "../style.css";

import food1 from "../images/food1.jpg";
import food2 from "../images/food2.jpg";
import food3 from "../images/food3.jpg";
import food4 from "../images/food4.jpg";

const images = [food1, food2, food3, food4];

function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1>Delicious Food, Delivered Fast 🍔</h1>
          <p>
            Order from your favorite restaurants and enjoy fresh food at your doorstep.
          </p>
          <button className="order-btn">Order Now</button>
        </div>

        <div className="hero-right">
          <img src={images[currentImage]} alt="Food" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Choose Us</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🍽️ Variety</h3>
            <p>Multiple cuisines and restaurants at your fingertips.</p>
          </div>

          <div className="feature-card">
            <h3>⚡ Fast Delivery</h3>
            <p>Quick delivery with real-time tracking.</p>
          </div>

          <div className="feature-card">
            <h3>💳 Easy Payment</h3>
            <p>Secure online payments with multiple options.</p>
          </div>

          <div className="feature-card">
            <h3>📦 Live Tracking</h3>
            <p>Track your order like real apps.</p>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="packages">
        <h2>Our Plans</h2>

        <div className="package-cards">
          <div className="package-card">
            <h3>Single Restaurant</h3>
            <p>Perfect for individual restaurant owners.</p>
            <button>Get Started</button>
          </div>

          <div className="package-card highlight">
            <h3>Multi Restaurant</h3>
            <p>Create your own platform like Swiggy/Zomato.</p>
            <button>Start Now</button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;