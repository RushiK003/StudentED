const express = require('express');
const Habit = require('../models/Habit');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all habits for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.id });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new habit
router.post('/', verifyToken, async (req, res) => {
    try {
        const habit = new Habit({
            userId: req.user.id,
            title: req.body.title
        });
        await habit.save();
        res.status(201).json(habit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a habit (Toggle completion)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        habit.completed = req.body.completed ?? habit.completed;
        habit.title = req.body.title ?? habit.title;
        await habit.save();
        res.json(habit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a habit
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!habit) return res.status(404).json({ message: 'Habit not found' });
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
