const request = require('supertest');
const app = require('../server');
const OpenAI = require('openai');

// Mock OpenAI
jest.mock('openai');

describe('AI Mocking', () => {
    it('should process logic without calling real OpenAI API', async () => {
        // Mock Implementation
        OpenAI.mockImplementation(() => ({
            chat: {
                completions: {
                    create: jest.fn().mockResolvedValue({
                        choices: [{ message: { content: 'Mocked AI Answer' } }]
                    })
                }
            }
        }));

        // Register User
        const userRes = await request(app)
            .post('/api/auth/register')
            .send({ username: 'ai_tester', password: 'password', role: 'student', classId: 'ClassA' });
        const token = userRes.body.token;

        // Post Doubt
        const res = await request(app)
            .post('/api/doubts')
            .set('Authorization', `Bearer ${token}`)
            .send({ question: 'Test Question', classId: 'ClassA' });

        expect(res.body.aiAnswer).toBe('Mocked AI Answer');
    });
});
