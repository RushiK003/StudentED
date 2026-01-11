const express = require('express');
const Class = require('../models/Class');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Middleware: Only Teachers and Admins can manage classes
router.use(verifyToken, checkRole(['teacher', 'admin']));

// Get all classes (for the logged-in teacher)
router.get('/', async (req, res) => {
    try {
        // Admin sees all, Teacher sees own
        const query = req.user.role === 'admin' ? {} : { teacherId: req.user.id };
        const classes = await Class.find(query);
        res.json(classes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a class
router.post('/', async (req, res) => {
    try {
        const newClass = new Class({
            name: req.body.name,
            description: req.body.description,
            teacherId: req.user.id
        });
        await newClass.save();
        res.status(201).json(newClass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
