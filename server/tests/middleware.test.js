const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const { protect } = require('../src/middleware/auth');

jest.mock('jsonwebtoken');
jest.mock('../src/models/User');

describe('auth.protect', () => {
    it('returns 401 if no Authorization header', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await protect(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toMatchObject({
            msg: expect.stringMatching(/Not authorized: no token provided/i)
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next() and attaches req.user if token is valid', async () => {
        const fakeUser = { id: 'user1234', name:'Test' };

        jwt.verify.mockReturnValue({ id: 'user1234' });

        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(fakeUser)
        });

        const req = httpMocks.createRequest();
        req.headers.authorization = 'Bearer faketoken';
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await protect(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual(fakeUser);
    });
});