const jwt = require('jsonwebtoken');
const User = require('../models/User');

// protect verifies JWT and attaches user to req.user
exports.protect = async (req, res, next) => {
    let token = null;
    //Pulls token from Authorization header ("Bearer <token>")
    if (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ){token = req.headers.authorization.split(' ')[1];}
    if (!token){
        return res
        .status(401).json({ msg: 'Not authorized: no token provided'});
    }

    try {
        //Verify and decode
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Fetches User
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        console.error('Auth protect error:', err);
        if (err.name === 'TokenExpiredError'){
            return res.status(401).json({ error: 'Session expired' });
        }
        res.status(401).json({ msg: 'Not authorized: token failed.'});
    }
};

//Authorize to restrict for roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        //req.user checked in protect function
        if (!req.user){
            return res
            .status(401).json({ msg: 'Not authorized: no user on request.'});
        }
        //If users role isn't allowed it is blocked
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Forbidden'});
        }
        next();
    };
};