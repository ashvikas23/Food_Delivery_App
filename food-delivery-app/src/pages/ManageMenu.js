import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function ManageMenu() {
  const [menu, setMenu] = useState([]);
  const [formData, setFormData] = useState({
    restaurant_id: "",
    name: "",
    category: "",
    description: "",
    price: "",
    review: "",
    image: "",
    is_available: true
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await axios.get("http://localhost:5000/admin/menu");
    setMenu(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      restaurant_id: "",
      name: "",
      category: "",
      description: "",
      price: "",
      review: "",
      image: "",
      is_available: true
    });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(
        `http://localhost:5000/admin/menu/${editId}`,
        formData
      );
    } else {
      await axios.post(
        "http://localhost:5000/admin/menu",
        formData
      );
    }

    fetchMenu();
    resetForm();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.item_id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/admin/menu/${id}`);
    fetchMenu();
  };

  return (
    <div className="admin-page">
      <h2>Manage Menu</h2>

      <div className="admin-form">
        <input type="number" name="restaurant_id" placeholder="Restaurant ID"
          value={formData.restaurant_id} onChange={handleChange} />

        <input type="text" name="name" placeholder="Item Name"
          value={formData.name} onChange={handleChange} />

        <input type="text" name="category" placeholder="Category"
          value={formData.category} onChange={handleChange} />

        <input type="text" name="description" placeholder="Description"
          value={formData.description} onChange={handleChange} />

        <input type="number" name="price" placeholder="Price"
          value={formData.price} onChange={handleChange} />

        <input type="text" name="review" placeholder="Review"
          value={formData.review} onChange={handleChange} />

        <input type="text" name="image" placeholder="Image name (dosa.jpg)"
          value={formData.image} onChange={handleChange} />

        <label>
          Available:
          <input type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
          />
        </label>

        <button onClick={handleSubmit}>
          {editId ? "Update Menu" : "Add Menu"}
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Restaurant</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Review</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {menu.map((item) => (
            <tr key={item.item_id}>
              <td>{item.item_id}</td>
              <td>{item.restaurant_id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>₹{item.price}</td>
              <td>{item.review}</td>
              <td>{item.is_available ? "Yes" : "No"}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.item_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageMenu;