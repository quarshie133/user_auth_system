const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ── HELPER: Generate a JWT token ───────────────────────────
// Takes a user ID, signs it with the secret, sets expiry
const generateToken = (id) => {
    return jwt.sign(
        { id },                         // payload — what we store inside the token
        process.env.JWT_SECRET,         // secret key to sign it  
        { expiresIn: process.env.JWT_EXPIRES_IN }   // token expires in 7 days
    );
}


// ══════════════════════════════════════════════════════════
// SIGNUP — POST /api/auth/signup
// ══════════════════════════════════════════════════════════
// What happens:
// 1. Check if email already exists
// 2. Create the user (pre-save hook hashes password automatically)
// 3. Generate a JWT and return it
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ username, email, password });

        const token = generateToken(user._id);

        res.status(201).json({          // ✅ .json() not .join()
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════════════════
// LOGIN — POST /api/auth/login
// ══════════════════════════════════════════════════════════
// What happens:
// 1. Find user by email
// 2. Compare entered password with stored hash using matchPassword()
// 3. If correct, generate a JWT and return it
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate both fields are present
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Find user — explicitly select password since it's hidden by default
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare entered password with stored hash
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════════════════
// GET ME — GET /api/auth/me  (Protected)
// Returns the currently logged in user's profile
// ══════════════════════════════════════════════════════════
const getMe = async (req, res) => {
    try {
        // req.user is set by the auth middleware after verifying the token
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ══════════════════════════════════════════════════════════
// GET ALL USERS — GET /api/auth/users (Protected)
// ══════════════════════════════════════════════════════════
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signup, login, getMe, getAllUsers };