const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await argon2.hash(password);
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: '[API AuthC]User registered successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).json({ error: '[API AuthC]User not found!' });

        const user = rows[0];
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) return res.status(400).json({ error: '[API AuthC]Invalid credentials!' });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email, avatar: user.avatar }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: '[API AuthC]No token, authorization denied!' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: '[API AuthC]Token is not valid!' });
    }
};

module.exports = { registerUser, loginUser, verifyToken };
