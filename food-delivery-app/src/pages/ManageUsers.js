import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer"
  });

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/admin/users")
      .then((res) => {
        console.log("USERS:", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("Fetch users error:", err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addUser = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill required fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/admin/users", form);
      alert("User added successfully");
      resetForm();
      fetchUsers();
    } catch (error) {
      console.log("Add user error:", error);
      alert("Error adding user");
    }
  };

  const editUser = (user) => {
    setEditingId(user.user_id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "customer"
    });
  };

  const updateUser = async () => {
    try {
      await axios.put(
        `http://localhost:5000/admin/users/${editingId}`,
        form
      );
      alert("User updated successfully");
      setEditingId(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.log("Update user error:", error);
      alert("Update failed");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.log("Delete user error:", error);
        alert("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "customer"
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card admin-card">
        <h2>Manage Users</h2>

        <div className="auth-form">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          {editingId ? (
            <button className="auth-btn" onClick={updateUser}>
              Update User
            </button>
          ) : (
            <button className="auth-btn" onClick={addUser}>
              Add User
            </button>
          )}
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.address}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => editUser(u)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(u.user_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;