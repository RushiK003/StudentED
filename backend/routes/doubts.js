const express = require('express');
const Chapter = require('../models/Chapter');
const { verifyToken, checkRole } = require('../middleware/auth');
const model = require('../utils/gemini');
const Doubt = require('../models/Doubt');

const router = express.Router();

// Ask Doubt (Student)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { question, chapterId, classId } = req.body;

        // 1. Fetch Context (Chapter Summary)
        let context = "";
        if (chapterId) {
            const chapter = await Chapter.findById(chapterId);
            if (chapter) context = `Context: ${chapter.aiSummary} \n Key Concepts: ${chapter.keyConcepts.join(', ')}`;
        }

        // 2. AI Answer
        const prompt = `
      Student Question: ${question}
      ${context}
      
      Answer clearly and concisely as a teacher.
    `;

        const result = await model.generateContent(prompt);
        const aiAnswer = result.response.text();

        // 3. Save
        const doubt = new Doubt({
            studentId: req.user.id,
            classId,
            chapterId,
            question,
            aiAnswer
        });
        await doubt.save();

        res.status(201).json(doubt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Doubts (FAQ) for Class
router.get('/:classId', async (req, res) => {
    try {
        const doubts = await Doubt.find({ classId: req.params.classId })
            .populate('studentId', 'username')
            .populate('chapterId', 'title')
            .sort({ isVerified: -1, createdAt: -1 }); // Verified top, then new
        res.json(doubts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Teacher: Verify/Edit Answer
router.put('/:id/verify', checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const { teacherAnswer, isVerified } = req.body;
        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

        if (teacherAnswer) doubt.teacherAnswer = teacherAnswer;
        if (isVerified !== undefined) doubt.isVerified = isVerified;

        await doubt.save();
        res.json(doubt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
