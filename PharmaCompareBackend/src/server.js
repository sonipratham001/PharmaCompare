const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { port, mongoURI } = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.send('PharmaCompare API is running!'));

const medicineRoutes = require('./routes/medicineRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/medicines', medicineRoutes);
app.use('/pharmacies', pharmacyRoutes);
app.use('/users', userRoutes);

const User = require('./models/User');
const Medicine = require('./models/Medicine');
const Pharmacy = require('./models/Pharmacy');

// Example test route
app.get('/test', async (req, res) => {
    try {
        const sampleMedicine = await Medicine.create({
            name: 'Paracetamol',
            description: 'Pain relief and fever reduction',
        });

        const samplePharmacy = await Pharmacy.create({
            name: 'HealthPlus Pharmacy',
            address: '123 Main Street',
            medicines: [{ medicine: sampleMedicine._id, price: 20 }],
        });

        const sampleUser = await User.create({
            username: 'john_doe',
            email: 'john@example.com',
            password: 'hashed_password',
            favorites: [sampleMedicine._id],
        });

        res.json({ sampleMedicine, samplePharmacy, sampleUser });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating test data');
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 