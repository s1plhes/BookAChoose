const express = require('express');
const router = express.Router();
const { addToBlacklist } = require('../middleware/tokenBlacklist');
const jwt = require('jsonwebtoken');

router.post('/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    try {
        // Verify the token to get its payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the token to the blacklist
        addToBlacklist(token);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
