import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    name: "",
    location: "",
    phone: "",
    rating: "",
    delivery_time: "",
    is_active: 1
  };

  const [form, setForm] = useState(initialForm);

  const fetchRestaurants = () => {
    axios.get("http://localhost:5000/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "is_active" ? Number(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      axios.put(`http://localhost:5000/admin/restaurants/${editId}`, form)
        .then(() => {
          fetchRestaurants();
          setEditId(null);
          setForm(initialForm);
        })
        .catch(err => console.log(err));
    } else {
      axios.post("http://localhost:5000/admin/restaurants", form)
        .then(() => {
          fetchRestaurants();
          setForm(initialForm);
        })
        .catch(err => console.log(err));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/admin/restaurants/${id}`)
      .then(() => fetchRestaurants())
      .catch(err => console.log(err));
  };

  const handleEdit = (r) => {
    setEditId(r.restaurant_id);
    setForm({
      name: r.name,
      location: r.location,
      phone: r.phone,
      rating: r.rating,
      delivery_time: r.delivery_time,
      is_active: r.is_active
    });
  };

  return (
    <div className="admin-page">
      <h2>Manage Restaurants</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input name="name" placeholder="Restaurant Name" value={form.name} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input type="number" name="rating" placeholder="Rating (1-5)" value={form.rating} onChange={handleChange} />
        <input type="number" name="delivery_time" placeholder="Delivery Time (mins)" value={form.delivery_time} onChange={handleChange} />

        <select name="is_active" value={form.is_active} onChange={handleChange}>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>

        <button type="submit" className="admin-btn add-btn">
          {editId ? "Update Restaurant" : "Add Restaurant"}
        </button>
      </form>

      <div className="admin-list">
        {restaurants.map(r => (
          <div key={r.restaurant_id} className="admin-card">
            <div>
              <h3>{r.name}</h3>
              <p>{r.location}</p>
              <p>⭐ {r.rating}</p>
              <p>📞 {r.phone}</p>
              <p>⏱ {r.delivery_time} mins</p>
              <p>Status: {r.is_active ? "Active" : "Inactive"}</p>
            </div>

            <div className="admin-actions">
              <button className="admin-btn edit-btn" onClick={() => handleEdit(r)}>
                Edit
              </button>
              <button className="admin-btn delete-btn" onClick={() => handleDelete(r.restaurant_id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageRestaurants;