const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const GroceryItem = require("./GroceryItem");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://capstone123:capstone123@cluster0.2y2ujpq.mongodb.net/smartgrocery",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Grocery routes
app.post("/api/groceries", async (req, res) => {
  try {
    const item = new GroceryItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/groceries", async (req, res) => {
  try {
    const items = await GroceryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const mealRoutes = require('./mealroutes');
app.use('/api/meals', mealRoutes);

const budgetRoutes = require('./budgetroutes');
app.use('/api/budget', budgetRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
