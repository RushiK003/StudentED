const mongoose = require('mongoose');

const StudentLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    hours: { type: Number, required: true },
    mood: { type: String, required: true },
    goals: { type: String, required: true },
    reflection: { type: String },
    notes: { type: String },
    tasks: [{
        text: { type: String, required: true },
        isCompleted: { type: Boolean, default: false }
    }]
}, { timestamps: true });

// TTL Index: Expire after 30 days (2592000 seconds)
StudentLogSchema.index({ date: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('StudentLog', StudentLogSchema);
