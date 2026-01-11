const mongoose = require('mongoose');

beforeAll(async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    // Connect to a test database (in memory or separate local DB)
    const url = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/student_empower_test';
    await mongoose.connect(url);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
