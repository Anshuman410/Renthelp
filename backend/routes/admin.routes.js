const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const User = require("../models/user.model");
const Property = require("../models/property.model");

/**
 * 🛡️ All routes below are ADMIN ONLY
 * Middleware order:
 * 1) auth  -> JWT verify
 * 2) roleMiddleware("admin") -> role check
 */

/**
 * 👥 GET ALL USERS
 * Admin can view all users (tenant + landlord)
 */
router.get(
  "/users",
  auth,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

/**
 * 🚫 BLOCK / UNBLOCK USER
 */
router.patch(
  "/users/:id/block",
  auth,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.json({
        message: user.isBlocked ? "User blocked" : "User unblocked"
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to update user status" });
    }
  }
);

/**
 * ❌ DELETE USER (Spam control)
 */
router.delete(
  "/users/:id",
  auth,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
);

/**
 * 🏠 GET ALL PROPERTIES (with owner details)
 */
router.get(
  "/properties",
  auth,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const properties = await Property.find().populate(
        "landlord",
        "name email role"
      );
      res.json(properties);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  }
);

/**
 * ❌ DELETE PROPERTY (moderation)
 */
router.delete(
  "/properties/:id",
  auth,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const property = await Property.findByIdAndDelete(req.params.id);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({ message: "Property deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  }
);

module.exports = router;
