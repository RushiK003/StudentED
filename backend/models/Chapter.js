const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    classId: { type: String, required: true }, // Not using ref for simplicity, can be string ID
    pdfPath: { type: String, required: true },
    aiSummary: { type: String },
    keyConcepts: [{ type: String }],
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);
