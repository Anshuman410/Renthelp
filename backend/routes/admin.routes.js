const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const auth = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// GET all users (Name, Email, Contact, Role)
router.get("/users", auth, roleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Password hide karke sab details fetch
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a user
router.delete("/users/:id", auth, roleMiddleware("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
