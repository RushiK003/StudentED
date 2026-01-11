const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const StudentLog = require('../models/StudentLog');
const Doubt = require('../models/Doubt');
const model = require('../utils/gemini');
const { verifyToken, checkRole } = require('../middleware/auth');

// Early Warning System
// Early Warning System
router.post('/early-warning', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

        // Fetch logs for last 2 weeks
        const logs = await StudentLog.find({
            userId,
            date: { $gte: fourteenDaysAgo }
        });

        // Split into two weeks
        let currentWeekHours = 0;
        let lastWeekHours = 0;

        logs.forEach(log => {
            if (log.date >= sevenDaysAgo) currentWeekHours += log.hours;
            else lastWeekHours += log.hours;
        });

        // Check for 50% drop
        let message = "Consistency looks good!";
        let alert = false;

        if (lastWeekHours > 0 && currentWeekHours < (lastWeekHours * 0.5)) {
            const prompt = `
             This student's study hours dropped significantly.
             Last Week: ${lastWeekHours} hours.
             This Week: ${currentWeekHours} hours.
             
             Draft a short, encouraging check-in message (max 2 sentences).
             `;

            const result = await model.generateContent(prompt);
            message = result.response.text();
            alert = true;
        }

        res.json({ message, alert });

    } catch (err) {
        console.error("Early Warning System Error:", err);

        let errorMessage = "Analysis Service Unavailable";
        if (err.message && err.message.includes("quota")) {
            console.error("⚠️ Gemini Quota Exceeded");
            errorMessage = "AI Mentor is taking a break (Quota Exceeded)";
        } else if (err.message && err.message.includes("API key")) {
            console.error("⚠️ Gemini API Key Invalid");
            errorMessage = "System Configuration Error (API Key)";
        }

        // Return success with alert=false instead of 500 to avoid breaking the UI completely
        // The user just won't get a specifically generated message
        res.json({ message: "Keep up the good work!", alert: false, error: errorMessage });
    }
});

// 2. Teacher Analytics (Teacher Only)
router.get('/teacher/:classId', checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const { classId } = req.params;

        // A. Most Doubted Topics (Top 5 Chapters with most doubts)
        const topDoubts = await Doubt.aggregate([
            { $match: { classId } },
            { $group: { _id: "$chapterId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'chapters', localField: '_id', foreignField: '_id', as: 'chapter' } },
            { $unwind: { path: "$chapter", preserveNullAndEmptyArrays: true } }, // Handle doubts without chapters
            { $project: { title: { $ifNull: ["$chapter.title", "General Questions"] }, count: 1 } }
        ]);

        // B. Class Consistency (Mock logic for now as detailed consistency requires complex user-log joins)
        // In a real app, we'd calculate % of students with > X hours/week.
        // Here we count total logs in the last 7 days for the class (assuming we can link logs to class via User)
        // For simplicity in this MERN stack without complex lookups, we'll return a placeholder or total logs count.
        // To do it properly: User.find({classId}) -> for each user count logs. 

        // Efficient Approx: Count total verifies vs total doubts
        const solvedStats = await Doubt.aggregate([
            { $match: { classId } },
            { $group: { _id: null, total: { $sum: 1 }, verified: { $sum: { $cond: ["$isVerified", 1, 0] } } } }
        ]);

        res.json({
            topDoubts,
            doubtResolution: solvedStats[0] || { total: 0, verified: 0 }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
});

module.exports = router;
