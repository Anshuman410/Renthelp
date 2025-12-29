const express = require("express");

const auth = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const Interest = require("../models/interest.model");
const Property = require("../models/property.model");

const router = express.Router();

/* =====================================
   TENANT → SHOW INTEREST IN PROPERTY
===================================== */
router.post(
  "/:propertyId",
  auth,
  roleMiddleware("tenant"),
  async (req, res) => {
    try {
      const { propertyId } = req.params;
      const tenantId = req.user.id;

      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.isOccupied) {
        return res.status(400).json({ message: "Property already occupied" });
      }

      const alreadyInterested = await Interest.findOne({
        property: propertyId,
        tenant: tenantId
      });

      if (alreadyInterested) {
        return res
          .status(400)
          .json({ message: "You already showed interest in this property" });
      }

      const interest = await Interest.create({
        property: propertyId,
        tenant: tenantId,
        landlord: property.landlord
      });

      res.status(201).json({
        message: "Interest sent successfully",
        interest
      });
    } catch (err) {
      console.error("INTEREST ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================
   LANDLORD → VIEW INTERESTED TENANTS
===================================== */
router.get(
  "/property/:propertyId",
  auth,
  roleMiddleware("landlord"),
  async (req, res) => {
    try {
      const { propertyId } = req.params;

      const interests = await Interest.find({ property: propertyId })
        .populate("tenant", "-password")
        .sort({ createdAt: -1 });

      res.json(interests);
    } catch (err) {
      console.error("FETCH INTEREST ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================
   LANDLORD → VIEW ALL INTERESTS
===================================== */
router.get(
  "/landlord/my-interests",
  auth,
  roleMiddleware("landlord"),
  async (req, res) => {
    try {
      const interests = await Interest.find({
        landlord: req.user.id
      })
        .populate("property")
        .populate("tenant", "-password")
        .sort({ createdAt: -1 });

      res.json(interests);
    } catch (err) {
      console.error("LANDLORD INTEREST ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
