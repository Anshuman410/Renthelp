const mongoose = require("mongoose");

// User Schema defining the structure for Tenants, Landlords, and Admins
const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // ✨ Added contact field to store the user's 10-digit mobile number
  contact: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["tenant", "landlord", "admin"], 
    default: "tenant" 
  },
  // Admin feature to disable users if they violate terms
  isBlocked: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model("User", UserSchema);
