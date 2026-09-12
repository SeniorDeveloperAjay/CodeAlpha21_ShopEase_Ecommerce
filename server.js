require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./backend/User");
const Product = require("./backend/Product");
const Order = require("./backend/Order");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
});
// login route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});
// Get a single product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
});
// Place a new order
app.post("/api/orders", async (req, res) => {
  try {
    const {
      customerName,
      email,
      address,
      city,
      pincode,
      products,
      totalAmount,
    } = req.body;

    const order = new Order({
      customerName: customerName,
      email: email,
      address: address,
      city: city,
      pincode: pincode,
      products: products,
      totalAmount: totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.log("Order error:", error);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
});
// GET orders for a user
app.get("/api/orders", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const orders = await Order.find({ email }).sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.log("Fetch orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
