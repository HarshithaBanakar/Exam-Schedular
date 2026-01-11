const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper function to transform MongoDB _id to id
const transformUser = (user) => {
    const obj = user.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    delete obj.password; // Never send password to frontend
    return obj;
};

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'faculty'
        });

        const savedUser = await user.save();
        res.status(201).json(transformUser(savedUser));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json(transformUser(user));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
