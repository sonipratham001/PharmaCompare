const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const { jwtSecret } = require('../config');


const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
        const verified = jwt.verify(token, jwtSecret); // Decode and verify token
        req.user = verified; // Attach decoded user data to request
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Register a new user
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });

        // Save the user
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Authenticate user and return a JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token with updated expiration time
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' }); // Token valid for 7 days
      res.json({ token });
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
// Retrieve user's favorite medicines
router.get('/favorites', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites', 'name description'); // Populate favorite medicines
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.favorites);
    } catch (err) {
        console.error('Error fetching favorites:', err.message);
        res.status(500).json({ message: 'Error fetching favorites', error: err.message });
    }
});

// Add a medicine to favorites
router.post('/favorites', verifyToken, async (req, res) => {
    const { medicineId } = req.body;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(medicineId)) {
        return res.status(400).json({ message: 'Invalid medicine ID' });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the medicine is already in favorites
      if (user.favorites.includes(medicineId)) {
        return res.status(400).json({ message: 'Medicine is already in favorites' });
      }
  
      // Add medicine to favorites
      user.favorites.push(medicineId);
      await user.save();
      res.status(200).json({ message: 'Medicine added to favorites' });
    } catch (err) {
      console.error('Error adding to favorites:', err.message);
      res.status(500).json({ message: 'Error adding to favorites', error: err.message });
    }
  });

// Remove a medicine from favorites
router.delete('/favorites/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid medicine ID' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove medicine from favorites
        user.favorites = user.favorites.filter((fav) => fav.toString() !== id);
        await user.save();
        res.status(200).json({ message: 'Medicine removed from favorites' });
    } catch (err) {
        console.error('Error removing favorite:', err.message);
        res.status(500).json({ message: 'Error removing favorite', error: err.message });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .select('username email favorites') // Include only necessary fields
        .populate('favorites', 'name description'); // Populate favorites with specific fields
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user); // Send user data
    } catch (err) {
      console.error('Error fetching user profile:', err.message);
      res.status(500).json({ message: 'Error fetching user profile', error: err.message });
    }
  });

module.exports = router; 