const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
