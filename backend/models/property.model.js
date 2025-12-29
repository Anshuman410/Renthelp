const mongoose = require("mongoose");

/**
 * 🏠 PROPERTY SCHEMA
 * Created by Landlord
 */
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true,
      index: true
    },

    price: {
      type: Number,
      required: true
    },

    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isOccupied: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Property", propertySchema);
