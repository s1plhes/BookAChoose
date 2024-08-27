import { Router } from 'express';
const router = Router();
import { addToBlacklist } from '../middleware/tokenBlacklist';
import { verify } from 'jsonwebtoken';

router.post('/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET);

        // Add token to blacklist
        addToBlacklist(token);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default router;
