const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');

// GET /pharmacies
// Fetch all pharmacies
router.get("/", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({}, { _id: 1, name: 1 }); // Fetch only name and ID
    if (!pharmacies.length) {
      return res.status(404).json({ message: "No pharmacies found." });
    }
    res.json(pharmacies); // Send the list of pharmacies as a response
  } catch (err) {
    console.error("Error fetching pharmacies:", err.message);
    res.status(500).json({ error: "Failed to fetch pharmacies." });
  }
});

// POST /pharmacies
// Add a new pharmacy
router.post("/", async (req, res) => {
  const { name, address, medicines } = req.body;

  // Validate required fields
  if (!name || !address) {
    return res.status(400).json({ error: "Name and address are required." });
  }

  try {
    // Check for duplicate pharmacy name
    const existingPharmacy = await Pharmacy.findOne({ name });
    if (existingPharmacy) {
      return res.status(400).json({ error: "Pharmacy with this name already exists." });
    }

    // Resolve medicine names into ObjectIDs and attach their prices
    let resolvedMedicines = [];
    if (medicines && medicines.length > 0) {
      resolvedMedicines = await Medicine.find(
        { name: { $in: medicines.map(med => med.name) } }, // Fetch medicines by name
        { _id: 1, name: 1 } // Only fetch ObjectIds and names
      );

      // Ensure that all provided medicines are valid and exist in the database
      if (resolvedMedicines.length !== medicines.length) {
        return res.status(400).json({ error: "Some medicine names are invalid or not found." });
      }
    }

    // Map medicine names to their corresponding ObjectId and prices
    const medicinesWithIdsAndPrices = medicines.map(medicine => {
      const foundMedicine = resolvedMedicines.find(resolved => resolved.name === medicine.name);
      if (foundMedicine) {
        return { medicine: foundMedicine._id, price: medicine.price };
      } else {
        return null;
      }
    }).filter(medicine => medicine !== null); // Remove invalid medicines

    // Create a new pharmacy
    const newPharmacy = new Pharmacy({
      name,
      address,
      medicines: medicinesWithIdsAndPrices,
    });

    // Save the pharmacy to the database
    const savedPharmacy = await newPharmacy.save();

    res.status(201).json({ message: "Pharmacy added successfully.", savedPharmacy });
  } catch (err) {
    console.error("Error adding pharmacy:", err.message);
    res.status(500).json({ error: "Failed to add pharmacy." });
  }
});

module.exports = router;