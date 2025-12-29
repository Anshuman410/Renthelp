require("dotenv").config();
const express = require("express");
const cors = require("cors");

// DB
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const propertyRoutes = require("./routes/property.routes");
const interestRoutes = require("./routes/interest.routes");

const app = express();

/* ======================
   MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   CONNECT DATABASE
====================== */
connectDB();

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("RentConnect Backend is Running 🚀");
});

/* ======================
   API ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/interests", interestRoutes);

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ======================
   SERVER START
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
