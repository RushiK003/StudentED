const express = require('express');
const StudentLog = require('../models/StudentLog');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Middleware: Verify Token for all routes
router.use(verifyToken);

// Create Daily Log
router.post('/', async (req, res) => {
    try {
        const log = new StudentLog({
            userId: req.user.id,
            hours: req.body.hours,
            mood: req.body.mood,
            goals: req.body.goals,
            date: req.body.date || Date.now()
        });
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Logs for Current User
router.get('/', async (req, res) => {
    try {
        const logs = await StudentLog.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
