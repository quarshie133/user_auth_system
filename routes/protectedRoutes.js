const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');


// Example of a fully protected route
// Any route in here requires a valid JWT
router.get('/dashboard', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: `Welcome to your dashboard, ${req.user.username}!`,
        user: req.user,
    });
});

module.exports = router;
