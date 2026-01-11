const dotenv = require('dotenv');
// Load env vars before any other imports
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const classRoutes = require('./routes/classes');
const studentLogRoutes = require('./routes/studentLogs');
const chapterRoutes = require('./routes/chapters');
const doubtRoutes = require('./routes/doubts');
const analyticsRoutes = require('./routes/analytics');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/student-logs', studentLogRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', require('./routes/aiRoutes')); // New Gemini Mentor Route

// Database Connection
// Database Connection
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => {
            console.error('❌ MongoDB Connection Error:', err);
            // Don't exit process in dev, but log heavily
        });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
        .on('error', err => console.error('❌ Server Listen Error:', err));
}

module.exports = app;
