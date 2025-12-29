const mongoose = require("mongoose");

/**
 * ❤️ INTEREST SCHEMA
 * Tenant → Property → Landlord
 */
const interestSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * 🚫 Prevent duplicate interest
 * Same tenant cannot show interest twice on same property
 */
interestSchema.index(
  { property: 1, tenant: 1 },
  { unique: true }
);

module.exports = mongoose.model("Interest", interestSchema);
