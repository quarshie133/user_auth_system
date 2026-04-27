const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes - no token needed
router.post('/signup', signup);
router.post('/login', login);

// Protected route - token required
router.get('/me', protect, getMe); // protect runs first, then getMe

module.exports = router;