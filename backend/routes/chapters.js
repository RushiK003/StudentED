const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const Chapter = require('../models/Chapter');
const { verifyToken, checkRole } = require('../middleware/auth');
const model = require('../utils/gemini');

const router = express.Router();

// Setup Multer for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Middleware: Verify Token
router.use(verifyToken);

// Upload PDF & Generate AI Summary (Teacher Only)
router.post('/upload', verifyToken, checkRole(['teacher']), upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // 1. Extract Text
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        const text = data.text.substring(0, 3000); // Limit context

        // 2. Call Gemini for Analysis
        const prompt = `
      Analyze this educational content:
      ${text}

      Output a JSON object with:
      {
        "summary": "2-3 sentence summary",
        "keyConcepts": ["concept1", "concept2", "concept3"]
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Cleanup JSON markdown if present
        const jsonString = responseText.replace(/```json|```/g, '').trim();
        const aiResult = JSON.parse(jsonString);

        // 3. Save to DB
        const chapter = new Chapter({
            title: req.body.title || req.file.originalname,
            classId: req.body.classId,
            pdfPath: `/uploads/${req.file.filename}`,
            aiSummary: aiResult.summary,
            keyConcepts: aiResult.keyConcepts,
            teacherId: req.user.id
        });
        await chapter.save();

        res.status(201).json(chapter);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

// Get Chapters (for a specific class)
router.get('/:classId', async (req, res) => {
    try {
        const chapters = await Chapter.find({ classId: req.params.classId }).sort({ createdAt: -1 });
        res.json(chapters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
