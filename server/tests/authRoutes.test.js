const request = require('supertest');
const app = require('../src/app');

describe('POST /api/auth/register & /api/auth/login', () => {
    it('registers a user and returns a token', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Sally', email: 'sally@example.com', password: 'secret' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('logs in existing user and returns a token', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ name: 'Carl', email: 'carl@example.com', password: 'pass123' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'carl@example.com', password: 'pass123' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
})