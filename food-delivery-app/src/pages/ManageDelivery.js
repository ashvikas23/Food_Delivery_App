import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function ManageDelivery() {

  const [partners, setPartners] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle: "",
    status: "available"
  });


  const fetchPartners = () => {

    axios
      .get("http://localhost:5000/admin/delivery-partners")
      .then(res => setPartners(res.data))
      .catch(err => console.log(err));

  };


  useEffect(() => {

    fetchPartners();

  }, []);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = (e) => {

    e.preventDefault();

    if (editId) {

      axios
        .put(`http://localhost:5000/admin/delivery-partners/${editId}`, form)
        .then(() => {

          fetchPartners();
          setEditId(null);

          setForm({
            name: "",
            phone: "",
            vehicle: "",
            status: "available"
          });

        });

    }

    else {

      axios
        .post("http://localhost:5000/admin/delivery-partners", form)
        .then(() => {

          fetchPartners();

          setForm({
            name: "",
            phone: "",
            vehicle: "",
            status: "available"
          });

        });

    }

  };


  const handleEdit = (p) => {

    setEditId(p.partner_id);

    setForm({
      name: p.name,
      phone: p.phone,
      vehicle: p.vehicle,
      status: p.status
    });

  };


  const handleDelete = (id) => {

    axios
      .delete(`http://localhost:5000/admin/delivery-partners/${id}`)
      .then(() => fetchPartners());

  };


  return (

    <div className="admin-page">

      <h2>Manage Delivery Partners</h2>


      <form onSubmit={handleSubmit} className="admin-form">

        <input
          name="name"
          placeholder="Partner Name"
          value={form.name}
          onChange={handleChange}
          required
        />


        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />


        <input
          name="vehicle"
          placeholder="Vehicle (Bike, Scooter)"
          value={form.vehicle}
          onChange={handleChange}
        />


        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >

          <option value="available">Available</option>

          <option value="busy">Busy</option>

          <option value="offline">Offline</option>

        </select>


        <button className="admin-btn">

          {editId ? "Update Partner" : "Add Partner"}

        </button>


      </form>


      <div className="admin-list">

        {partners.map(p => (

          <div key={p.partner_id} className="admin-card">

            <h3>{p.name}</h3>

            <p>📞 {p.phone}</p>

            <p>🚚 {p.vehicle}</p>

            <p>Status: {p.status}</p>


            <button
              className="edit-btn"
              onClick={() => handleEdit(p)}
            >
              Edit
            </button>


            <button
              className="delete-btn"
              onClick={() => handleDelete(p.partner_id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default ManageDelivery;