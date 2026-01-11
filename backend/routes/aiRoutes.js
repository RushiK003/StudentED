const express = require('express');
const router = express.Router();
const StudentLog = require('../models/StudentLog');
const { verifyToken } = require('../middleware/auth');
const model = require('../utils/gemini');

// Middleware
router.use(verifyToken);

// POST /api/ai/mentor-advice
router.post('/mentor-advice', async (req, res) => {
    try {
        // 1. Fetch last 7 days of logs
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const logs = await StudentLog.find({
            userId: req.user.id,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        // 2. Format Context
        const logSummary = logs.map(l =>
            `Date: ${l.date.toISOString().split('T')[0]}, Hours: ${l.hours}, Mood: ${l.mood}, Goals Completed: ${l.tasks?.filter(t => t.isCompleted).length || 0}/${l.tasks?.length || 0}`
        ).join('\n');

        // 3. Prompt Gemini
        const prompt = `
        Based on this student's recent study consistency:
        ${logSummary}

        Provide a 2-sentence empathetic coaching advice for tomorrow. 
        If they are skipping tasks, include a motivational nudge.
        Return ONLY the advice text.
        `;

        const result = await model.generateContent(prompt);
        const advice = result.response.text();

        res.json({ advice });
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: "AI Mentor is taking a nap. Try again later." });
    }
});

module.exports = router;
