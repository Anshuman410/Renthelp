const express = require("express");
const auth = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const Property = require("../models/property.model");

const router = express.Router();

/* =====================================
   TENANT → VIEW ALL AVAILABLE PROPERTIES
===================================== */
router.get("/", auth, roleMiddleware("tenant"), async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;

    const filter = { isOccupied: false };

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    console.error("FETCH PROPERTIES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================
   LANDLORD → ADD NEW PROPERTY
===================================== */
router.post("/", auth, roleMiddleware("landlord"), async (req, res) => {
  try {
    const { title, description, price, location } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const property = await Property.create({
      title,
      description,
      price,
      location,
      landlord: req.user.id
    });

    res.status(201).json({
      message: "Property added successfully",
      property
    });
  } catch (err) {
    console.error("ADD PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================
   LANDLORD → VIEW OWN PROPERTIES
   ⚠️ MUST BE ABOVE /:id
===================================== */
router.get(
  "/landlord/my-properties",
  auth,
  roleMiddleware("landlord"),
  async (req, res) => {
    try {
      console.log("LANDLORD ID:", req.user.id);

      const properties = await Property.find({
        landlord: req.user.id
      }).sort({ createdAt: -1 });

      res.json(properties);
    } catch (err) {
      console.error("MY PROPERTIES ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================
   TENANT → VIEW PROPERTY DETAILS
===================================== */
router.get("/:id", auth, roleMiddleware("tenant"), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property || property.isOccupied) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (err) {
    console.error("PROPERTY DETAILS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================
   LANDLORD → UPDATE PROPERTY
===================================== */
router.put("/:id", auth, roleMiddleware("landlord"), async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user.id },
      req.body,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      message: "Property updated successfully",
      property
    });
  } catch (err) {
    console.error("UPDATE PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================
   LANDLORD → DELETE PROPERTY
===================================== */
router.delete("/:id", auth, roleMiddleware("landlord"), async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      landlord: req.user.id
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================
   LANDLORD → MARK PROPERTY AS OCCUPIED
===================================== */
router.patch(
  "/:id/occupy",
  auth,
  roleMiddleware("landlord"),
  async (req, res) => {
    try {
      const property = await Property.findOneAndUpdate(
        { _id: req.params.id, landlord: req.user.id },
        { isOccupied: true },
        { new: true }
      );

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({
        message: "Property marked as occupied",
        property
      });
    } catch (err) {
      console.error("OCCUPY PROPERTY ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
