// controllers/search.controller.js
const Search = require('../models/searchModel');

exports.searchAll = async (req, res) => {
    try {
        const query = req.query.q || '';
        const results = await Search.search(query);
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'An error occurred while searching.' });
    }
};
