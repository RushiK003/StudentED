const mongoose = require('mongoose');

const DoubtSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: String, required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }, // Optional, linking to specific chapter
    question: { type: String, required: true },
    aiAnswer: { type: String },
    teacherAnswer: { type: String },
    isVerified: { type: Boolean, default: false }, // "Starred" by teacher
    isResolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Doubt', DoubtSchema);
