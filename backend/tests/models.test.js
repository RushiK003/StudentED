const mongoose = require('mongoose');
const StudentLog = require('../models/StudentLog');

describe('Data Persistence (TTL)', () => {
    it('should have a TTL index on the date field', async () => {
        const indexes = await StudentLog.collection.indexes();
        const ttlIndex = indexes.find(index => index.key.date === 1 && index.expireAfterSeconds);

        expect(ttlIndex).toBeDefined();
        expect(ttlIndex.expireAfterSeconds).toBe(2592000); // 30 days
    });
});
