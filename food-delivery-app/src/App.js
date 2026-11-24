import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Restaurants from "./pages/Restaurants";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Delivery from "./pages/Delivery";
import DeliverySuccess from "./pages/DeliverySuccess";
import AdminDashboard from "./pages/AdminDashboard";
import Receipt from "./pages/Receipt";
import ManageRestaurants from "./pages/ManageRestaurants";
import ManageUsers from "./pages/ManageUsers";
import ManageOrders from "./pages/ManageOrders";
import ManageMenu from "./pages/ManageMenu";
import ManageDelivery from "./pages/ManageDelivery";
import CartBar from "./components/CartBar";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main flow */}
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/menu/:restaurant_id" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/delivery-success" element={<DeliverySuccess />} />
        <Route path="/admin" element={<AdminDashboard />} />
       
<Route path="/admin/restaurants" element={<ManageRestaurants />} />
<Route path="/admin/users" element={<ManageUsers />} />
<Route path="/admin/orders" element={<ManageOrders />} />
<Route path="/admin/menu" element={<ManageMenu />} />
<Route path="/admin/delivery" element={<ManageDelivery />} />

      </Routes>
     

{/* ✅ OUTSIDE ROUTES */}
<CartBar />

    </Router>
  );
}

export default App;
