const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;
        // Check if token is in the Authorization header
        // Format expected: "Bearer eyJhbGciOiJIUzI1NiIs..."
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // extract token after "Bearer "
        }
        // No token found
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
        }

        // Verify the token — this also checks if it has expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded = { id: 'user_id_here', iat: ..., exp: ... }

        // Attach user to the request so controllers can access it
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        next(); // all good — move on to the controller

    } catch (error) {
        // jwt.verify throws errors for expired or invalid tokens
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired — please log in again' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { protect };
