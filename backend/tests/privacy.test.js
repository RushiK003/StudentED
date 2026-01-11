const request = require('supertest');
const app = require('../server');

jest.mock('openai', () => {
    return class OpenAI {
        constructor() {
            this.chat = {
                completions: {
                    create: jest.fn().mockResolvedValue({
                        choices: [{ message: { content: 'Mocked AI Answer' } }]
                    })
                }
            };
        }
    };
});

describe('Privacy & Scoping', () => {
    let student1Token, student2Token;

    beforeAll(async () => {
        const s1 = await request(app).post('/api/auth/register').send({ username: 's1', password: 'p', role: 'student', classId: 'ClassA' });
        student1Token = s1.body.token;

        const s2 = await request(app).post('/api/auth/register').send({ username: 's2', password: 'p', role: 'student', classId: 'ClassB' });
        student2Token = s2.body.token;
    });

    it('should verify log privacy (Student1 cannot see Student2 logs)', async () => {
        // S1 creates log
        await request(app).post('/api/student-logs').set('Authorization', `Bearer ${student1Token}`)
            .send({ hours: 1, mood: 'Good', goals: 'Study' });

        // S2 tries to fetch
        // Note: Our current route /student-logs returns "req.user.id" logs, so S2 naturally won't see S1's.
        // That IS the privacy check (implicit scoping).
        const res = await request(app).get('/api/student-logs').set('Authorization', `Bearer ${student2Token}`);
        expect(res.body.length).toBe(0);
    });

    it('should scope doubts by class', async () => {
        // S1 (ClassA) posts doubt
        await request(app).post('/api/doubts').set('Authorization', `Bearer ${student1Token}`)
            .send({ question: 'Q1', classId: 'ClassA' });

        // S2 (ClassB) fetches doubts for ClassB -> Should be empty
        const res = await request(app).get('/api/doubts/ClassB').set('Authorization', `Bearer ${student2Token}`);
        expect(res.body.length).toBe(0);
    });
});
