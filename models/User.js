const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // never return password field in queries by default
        },
    },
    { timestamps: true }
)


// ── PRE-SAVE HOOK ──────────────────────────────────────────
// This runs automatically before every .save()
// It hashes the password only if it was changed (or is new)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next() // skip if password unchanged

    const salt = await bcrypt.genSalt(10)  // generate random salt (10 rounds)
    this.password = await bcrypt.hash(this.password, salt) // hash + salt the password
    next()
});

// ── METHOD: Compare entered password with stored hash ──────
// Used during login to check if entered password is correct
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);

};


module.exports = mongoose.model('User', userSchema);

