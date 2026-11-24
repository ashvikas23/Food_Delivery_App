const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images")); // Serve menu images

// =========================
// DATABASE CONNECTION
// =========================
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "food_del",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, conn) => {
  if (err) console.error("DB connection failed:", err);
  else {
    console.log("✅ MySQL Connected Successfully");
    conn.release();
  }
});

// =========================
// USER AUTH
// =========================
app.post("/signup", (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const sql = `
    INSERT INTO users (name,email,password,phone,address,role,is_active)
    VALUES (?,?,?,?,?,'customer',TRUE)
  `;
  db.query(sql, [name, email, password, phone, address], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Signup successful" });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email=? AND password=? AND is_active=TRUE`;
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) res.json({ success: true, user: result[0] });
    else res.status(401).json({ error: "Invalid credentials" });
  });
});
/* =========================
   ADMIN USERS
========================= */

// GET ALL USERS
app.get("/admin/users", (req, res) => {

  const sql = `
    SELECT 
      user_id,
      name,
      email,
      password,
      phone,
      address,
      role,
      is_active
    FROM users
    ORDER BY user_id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log("FETCH USERS ERROR:", err);
      return res.status(500).json(err);
    }

    console.log("USERS:", result); // debug
    res.json(result);

  });

});


// ADD USER
app.post("/admin/users", (req, res) => {

  const { name, email, password, phone, address, role } = req.body;

  const sql = `
    INSERT INTO users 
    (name,email,password,phone,address,role,is_active)
    VALUES (?,?,?,?,?,?,1)
  `;

  db.query(
    sql,
    [
      name,
      email,
      password,
      phone || "",
      address || "",
      role || "customer"
    ],
    (err, result) => {

      if (err) {
        console.log("ADD USER ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "User added",
        id: result.insertId
      });

    }
  );

});


// UPDATE USER
app.put("/admin/users/:id", (req, res) => {

  const { id } = req.params;

  const { name, email, password, phone, address, role } = req.body;

  const sql = `
    UPDATE users SET
      name=?,
      email=?,
      password=?,
      phone=?,
      address=?,
      role=?
    WHERE user_id=?
  `;

  db.query(
    sql,
    [
      name,
      email,
      password,
      phone,
      address,
      role,
      id
    ],
    (err) => {

      if (err) {
        console.log("UPDATE USER ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "User updated"
      });

    }
  );

});


// DELETE USER (SOFT DELETE)
app.delete("/admin/users/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    UPDATE users
    SET is_active = 0
    WHERE user_id = ?
  `;

  db.query(sql, [id], (err) => {

    if (err) {
      console.log("DELETE USER ERROR:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "User deleted"
    });

  });

});

// =========================
// RESTAURANTS
// =========================

app.get("/restaurants", (req, res) => {
  db.query("SELECT * FROM restaurants WHERE is_active=TRUE", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get("/admin/restaurants", (req, res) => {
  db.query("SELECT * FROM restaurants ORDER BY restaurant_id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post("/admin/restaurants", (req, res) => {
  const { name, location, phone, rating } = req.body;
  const sql = `INSERT INTO restaurants (name,location,phone,rating,is_active) VALUES (?,?,?,?,TRUE)`;
  db.query(sql, [name, location, phone, rating], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Restaurant added successfully" });
  });
});

app.put("/admin/restaurants/:id", (req, res) => {
  const { id } = req.params;
  const { name, location, phone, rating, is_active } = req.body;
  const sql = `UPDATE restaurants SET name=?, location=?, phone=?, rating=?, is_active=? WHERE restaurant_id=?`;
  db.query(sql, [name, location, phone, rating, is_active, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Restaurant updated successfully" });
  });
});

app.delete("/admin/restaurants/:id", (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE restaurants SET is_active=FALSE WHERE restaurant_id=?`;
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("UPDATE menu_items SET is_available=FALSE WHERE restaurant_id=?", [id]);
    res.json({ message: "Restaurant deleted successfully" });
  });
});

/* =========================
   ADMIN DELIVERY PARTNERS
========================= */

// GET DELIVERY PARTNERS
app.get("/admin/delivery-partners", (req, res) => {

  const sql = `
    SELECT *
    FROM delivery_partners
    WHERE is_active = 1
    ORDER BY partner_id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log("FETCH DELIVERY ERROR:", err);
      return res.status(500).json(err);
    }

    res.json(result);

  });

});


// ADD DELIVERY PARTNER
app.post("/admin/delivery-partners", (req, res) => {

  const { name, phone, vehicle, status } = req.body;

  const sql = `
    INSERT INTO delivery_partners
    (name, phone, vehicle, status, is_active)
    VALUES (?, ?, ?, ?, 1)
  `;

  db.query(
    sql,
    [
      name,
      phone,
      vehicle,
      status || "available"
    ],
    (err, result) => {

      if (err) {
        console.log("ADD DELIVERY ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Delivery partner added",
        id: result.insertId
      });

    }
  );

});


// UPDATE DELIVERY PARTNER
app.put("/admin/delivery-partners/:id", (req, res) => {

  const { id } = req.params;
  const { name, phone, vehicle, status } = req.body;

  const sql = `
    UPDATE delivery_partners
    SET name=?, phone=?, vehicle=?, status=?
    WHERE partner_id=?
  `;

  db.query(
    sql,
    [
      name,
      phone,
      vehicle,
      status,
      id
    ],
    (err) => {

      if (err) {
        console.log("UPDATE DELIVERY ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Delivery partner updated"
      });

    }
  );

});


// DELETE DELIVERY PARTNER
app.delete("/admin/delivery-partners/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    UPDATE delivery_partners
    SET is_active = 0
    WHERE partner_id = ?
  `;

  db.query(sql, [id], (err) => {

    if (err) {
      console.log("DELETE DELIVERY ERROR:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Delivery partner removed"
    });

  });

});
// =========================
// MENU ITEMS
// =========================

app.get("/menu/:restaurant_id", (req, res) => {
  const { restaurant_id } = req.params;
  const sql = `
    SELECT m.*
    FROM menu_items m
    JOIN restaurants r ON m.restaurant_id=r.restaurant_id
    WHERE m.restaurant_id=? AND m.is_available=TRUE AND r.is_active=TRUE
  `;
  db.query(sql, [restaurant_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get("/admin/menu", (req, res) => {
  db.query("SELECT * FROM menu_items ORDER BY item_id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post("/admin/menu", (req, res) => {
  const { restaurant_id, name, category, description, price, review, is_available } = req.body;
  const sql = `
    INSERT INTO menu_items (restaurant_id,name,category,description,price,review,is_available)
    VALUES (?,?,?,?,?,?,?)
  `;
  db.query(
    sql,
    [restaurant_id, name, category, description, price, review || 0, is_available ? 1 : 0],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Menu item added successfully" });
    }
  );
});

app.put("/admin/menu/:id", (req, res) => {
  const { id } = req.params;
  const { restaurant_id, name, category, description, price, review, is_available } = req.body;
  const sql = `
    UPDATE menu_items SET restaurant_id=?, name=?, category=?, description=?, price=?, review=?, is_available=? WHERE item_id=?
  `;
  db.query(
    sql,
    [restaurant_id, name, category, description, price, review || 0, is_available ? 1 : 0, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Menu item updated successfully" });
    }
  );
});

app.delete("/admin/menu/:id", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE menu_items SET is_available=FALSE WHERE item_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Menu item deleted successfully" });
  });
});

// =========================
// ORDERS (FIXED ONLY HERE)
// =========================

app.post("/orders", (req, res) => {
  const { user_id, restaurant_id, total_amount } = req.body;
  const sql = `INSERT INTO orders (user_id, restaurant_id, total_amount,status) VALUES (?,?,?,'Placed')`;
  db.query(sql, [user_id, restaurant_id, total_amount], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order placed successfully" });
  });
});

// ✅ FIXED (MySQL version)
app.get("/api/orders/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT * FROM orders 
    WHERE user_id = ? 
    ORDER BY order_id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});// =========================
// ADMIN - GET ALL ORDERS
// =========================
app.get("/api/orders/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT * FROM orders
    WHERE user_id = ?
    ORDER BY order_id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// =========================
// START SERVER
// =========================
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));