const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);
