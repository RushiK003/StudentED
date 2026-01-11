const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth & Security', () => {
    it('should prevent Student from accessing Teacher routes', async () => {
        // 1. Register Student
        const studentRes = await request(app)
            .post('/api/auth/register')
            .send({ username: 'test_student_rbac', password: 'password', role: 'student', classId: 'ClassA' });
        const token = studentRes.body.token;

        // 2. Try to access Teacher Route
        const res = await request(app)
            .get('/api/analytics/teacher/ClassA')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(403);
    });
});
