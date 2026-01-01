const express = require("express");
const router = express.Router();
const Property = require("../models/property.model");
const auth = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const upload = require("../middleware/upload"); // ✨ Import Upload Middleware

// POST: Add new property with Image
router.post("/", auth, roleMiddleware("landlord"), upload.single('image'), async (req, res) => {
  try {
    const { title, location, price, description } = req.body;
    
    const property = new Property({
      title,
      location,
      price,
      description,
      imageUrl: req.file ? req.file.path : "", // ✨ Save Cloudinary URL
      landlord: req.user.id
    });

    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error while adding property" });
  }
});

// GET: All properties (For Tenants)
router.get("/", auth, async (req, res) => {
  try {
    const properties = await Property.find({ isOccupied: false });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Landlord's own properties
router.get("/landlord/my-properties", auth, roleMiddleware("landlord"), async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
