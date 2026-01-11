const express = require('express');
const { verifyToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get Current User
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
