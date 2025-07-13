const httpMocks = require('node-mocks-http');
const User = require('../src/models/User');
const { register } = require('../src/controllers/authController');

jest.mock('../src/models/User');

describe('authController.register', () => {
    it('creates a new user and returns 201 + user JSON', async () => {
        const fakeUser = {
            _id: 'abc123',
            name:'Bob',
            email: 'bob@example.com'
        };

        User.create.mockResolvedValue(fakeUser);

        const req = httpMocks.createRequest({ body: fakeUser });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await register(req, res, next);

        expect(res.statusCode).toBe(201);
        const data = res._getJSONData();
        expect(data).toHaveProperty('token');
        expect(data.user).toMatchObject({
            name: fakeUser.name,
            email: fakeUser.email,
        })

        expect(next).not.toHaveBeenCalled();
    });
});