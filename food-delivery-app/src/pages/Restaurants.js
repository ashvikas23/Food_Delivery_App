import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style.css";

// Import logos
import pureVegMeals from "../images/pure_veg_meals.png";
import dosaCorner from "../images/dosa_corner.png";
import idliExpress from "../images/idli_express.png";
import southIndianDelight from "../images/south_indian_delight.png";
import annapoornaVeg from "../images/annapoorna_veg.png";
import maduraiMess from "../images/madurai_mess.png";
import sriDosaPlaza from "../images/sri_dosa_plaza.png";
import idliHouse from "../images/idli_house.png";
import filterCoffeeCafe from "../images/filter_coffee_cafe.png";
import udupiVeg from "../images/udupi_veg.png";
import ravaDosaPoint from "../images/rava_dosa_point.png";
import miniTiffinHub from "../images/mini_tiffin_hub.png";
import andhraMeals from "../images/andhra_meals.png";
import gheeRoastHouse from "../images/ghee_roast_house.png";
import templeCityTiffin from "../images/temple_city_tiffin.png";

const logos = {
  "Pure Veg Meals": pureVegMeals,
  "Dosa Corner": dosaCorner,
  "Idli Express": idliExpress,
  "South Indian Delight": southIndianDelight,
  "Annapoorna Veg": annapoornaVeg,
  "Madurai Mess": maduraiMess,
  "Sri Dosa Plaza": sriDosaPlaza,
  "Idli House": idliHouse,
  "Filter Coffee Cafe": filterCoffeeCafe,
  "Udupi Veg": udupiVeg,
  "Rava Dosa Point": ravaDosaPoint,
  "Mini Tiffin Hub": miniTiffinHub,
  "Andhra Meals": andhraMeals,
  "Ghee Roast House": gheeRoastHouse,
  "Temple City Tiffins": templeCityTiffin,
};

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 📍 Detect real location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              data.address.state;

            setLocation(city || "All");
            setShowDropdown(false);
          } catch (err) {
            console.log(err);
            alert("Location detection failed");
          }
        },
        () => {
          alert("Location access denied");
        }
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  // 🔥 Filter restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      location === "All" ||
      r.location.toLowerCase().includes(location.toLowerCase());

    // Category check: match if any menu item contains category
    const matchesCategory =
      category === "All"
        ? true
        : r.menu_items?.some((item) =>
            item.category.toLowerCase().includes(category.toLowerCase())
          );

    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="restaurants-page">

      {/* 🔍 SEARCH + LOCATION */}
      <div className="top-search-bar">
        <div className="location-wrapper">
          <div
            className="location-box"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            📍 {location === "All" ? "Set Location" : location}
          </div>

          {showDropdown && (
            <div className="location-dropdown-box">
              <div
                onClick={() => {
                  setLocation("All");
                  setCategory("All");
                  setSearch("");
                  setShowDropdown(false);
                }}
              >
                🌍 All Locations
              </div>
              <div onClick={getLocation}>📍 Detect Current Location</div>
              <div onClick={() => { setLocation("Calicut"); setShowDropdown(false); }}>Calicut</div>
              <div onClick={() => { setLocation("Kochi"); setShowDropdown(false); }}>Kochi</div>
              <div onClick={() => { setLocation("Chennai"); setShowDropdown(false); }}>Chennai</div>
              <div onClick={() => { setLocation("Bangalore"); setShowDropdown(false); }}>Bangalore</div>
              <div onClick={() => { setLocation("Hyderabad"); setShowDropdown(false); }}>Hyderabad</div>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Search for restaurant, food or location"
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔥 BANNERS */}
      <div className="banner-container">
        <div className="banner">🔥 50% OFF on First Order</div>
        <div className="banner">🍔 Free Delivery above ₹199</div>
        <div className="banner">🥗 Healthy Food Week</div>
      </div>

      {/* 🍽 CATEGORIES */}
      <div className="categories">
        <div className="category" onClick={() => setCategory("All")}>All</div>
        <div className="category" onClick={() => setCategory("Pizza")}>🍕 Pizza</div>
        <div className="category" onClick={() => setCategory("Burger")}>🍔 Burger</div>
        <div className="category" onClick={() => setCategory("Biryani")}>🍛 Biryani</div>
        <div className="category" onClick={() => setCategory("Chinese")}>🍜 Chinese</div>
        <div className="category" onClick={() => setCategory("Drinks")}>🥤 Drinks</div>
      </div>

      <h2 className="page-title">Restaurants delivering to you</h2>

      {/* 🍽 RESTAURANTS */}
      <div className="restaurants-grid">
        {filteredRestaurants.map((r) => (
          <div
            key={r.restaurant_id}
            className="restaurant-card"
            onClick={() => navigate(`/menu/${r.restaurant_id}`)}
          >
            <img
              src={logos[r.name?.trim()] || templeCityTiffin}
              alt={r.name}
            />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <p className="location">{r.location}</p>
              <div className="meta">
                ⭐ {r.rating} • {r.review} reviews
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurants;