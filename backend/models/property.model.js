const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String, default: "" }, // ✨ New Field for Cloudinary URL
  isOccupied: { type: Boolean, default: false },
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Property", PropertySchema);
