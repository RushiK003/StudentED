const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
exports.register = async (req, res) => {
    try {
        const { username, password, role, classId } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({ username, password: hashedPassword, role, classId });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check valid password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid credentials' });

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role, classId: user.classId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                classId: user.classId
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Current User
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
