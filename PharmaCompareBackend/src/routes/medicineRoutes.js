const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

// GET /medicines
// Fetch medicines, optionally filtered by search query
router.get("/", async (req, res) => {
  const searchQuery = req.query.search; // Get the query parameter
  try {
    let medicines;
    if (searchQuery) {
      // Perform case-insensitive search using regex
      medicines = await Medicine.find({
        name: { $regex: searchQuery, $options: "i" },
      }).populate("pharmacies", "name address"); // Populate pharmacies with names and addresses
    } else {
      // Return all medicines if no query is provided
      medicines = await Medicine.find().populate("pharmacies", "name address");
    }
    res.json(medicines);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
});

// GET /medicines/:id
// Fetch a specific medicine by its ID and populate pharmacies with their names and addresses
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate("pharmacies", "name address");
    if (!medicine) return res.status(404).json({ error: "Medicine not found" });
    res.json(medicine);
  } catch (err) {
    console.error("Error fetching medicine details:", err.message);
    res.status(500).json({ error: "Failed to fetch medicine details" });
  }
});

// POST /medicines
// Add a new medicine, resolving pharmacy names into ObjectIDs
router.post("/", async (req, res) => {
  const { name, description, price, pharmacies } = req.body;

  try {
    // Validate required fields
    if (!name || !description || !price || !pharmacies) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate and resolve pharmacy names into ObjectIDs
    const resolvedPharmacies = await Pharmacy.find(
      { name: { $in: pharmacies } },
      { _id: 1 } // Only fetch ObjectIDs
    );

    if (resolvedPharmacies.length !== pharmacies.length) {
      return res.status(400).json({
        error: "Some pharmacy names are invalid or not found.",
      });
    }

    // Create a new medicine with pharmacies' ObjectIDs
    const newMedicine = new Medicine({
      name,
      description,
      price,
      pharmacies: resolvedPharmacies.map((pharmacy) => pharmacy._id), // Store ObjectIDs in the medicine record
    });

    // Save the medicine to the database
    const savedMedicine = await newMedicine.save();

    // Associate the medicine with pharmacies by updating each pharmacy's medicines list
    for (const pharmacy of resolvedPharmacies) {
      await Pharmacy.updateOne(
        { _id: pharmacy._id },
        { $push: { medicines: { medicine: savedMedicine._id, price } } }
      );
    }

    res.status(201).json({ message: "Medicine added successfully", savedMedicine });
  } catch (err) {
    console.error("Error adding medicine:", err.message);
    res.status(500).json({ error: "Failed to add medicine." });
  }
});

module.exports = router;