const express = require("express");
const router = express.Router();
const Property = require("../models/property.model");
const auth = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const upload = require("../middleware/upload"); // ✨ Cloudinary/Multer middleware

// ---------------------------------------------------------
// 1. POST: Add New Property (with Image Upload)
// ---------------------------------------------------------
router.post("/", auth, roleMiddleware("landlord"), upload.single('image'), async (req, res) => {
  try {
    const { title, location, price, description } = req.body;
    
    const property = new Property({
      title,
      location,
      price,
      description,
      imageUrl: req.file ? req.file.path : "", // ✨ Cloudinary URL save ho raha hai
      landlord: req.user.id
    });

    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.error("ADD PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error while adding property" });
  }
});

// ---------------------------------------------------------
// 2. GET: All Available Properties (For Tenants)
// ---------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;
    let query = { isOccupied: false };

    // Search filters
    if (location) query.location = new RegExp(location, "i");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching properties" });
  }
});

// ---------------------------------------------------------
// 3. GET: Landlord's Own Listings
// ---------------------------------------------------------
router.get("/landlord/my-properties", auth, roleMiddleware("landlord"), async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your listings" });
  }
});

// ---------------------------------------------------------
// 4. GET: Specific Property Details (FIX FOR 404 ERROR)
// ---------------------------------------------------------
// ✨ Yeh route missing tha, isliye detail page par 'Not Found' aa raha tha
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("landlord", "name email contact"); // ✨ Landlord ki details bhi fetch karega
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    console.error("GET BY ID ERROR:", err);
    res.status(500).json({ message: "Invalid Property ID" });
  }
});

// ---------------------------------------------------------
// 5. DELETE: Remove Property
// ---------------------------------------------------------
router.delete("/:id", auth, roleMiddleware("landlord"), async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, landlord: req.user.id });
    if (!property) return res.status(404).json({ message: "Property not found or unauthorized" });
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete error" });
  }
});

module.exports = router;
