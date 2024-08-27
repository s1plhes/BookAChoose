const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, loginUser, verifyToken } = require('../controllers/authController');

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.get('/:username/data', userController.getUserByName);
router.post('/users/create', authMiddleware, userController.createUser);
router.put('/users/update/:id/', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Access granted to profile!' });
});

module.exports = router;
