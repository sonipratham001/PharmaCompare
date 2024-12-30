const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId, // Ensure this is ObjectId
        ref: 'Medicine', // Reference the Medicine model
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);