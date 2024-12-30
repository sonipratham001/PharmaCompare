const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    medicines: [{
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine', // Reference to Medicine model
        },
        price: {
            type: Number,
            required: true,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Pharmacy', PharmacySchema);