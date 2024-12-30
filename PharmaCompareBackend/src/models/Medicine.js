const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number, // Add price field for better utility
      required: false,
    },
    pharmacies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pharmacy", // Reference to Pharmacy model
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("Medicine", MedicineSchema);