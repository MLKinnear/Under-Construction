const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token = null;
    if (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ){token = req.headers.authorization.split(' ')[1];}
    if (!token){
        return res
        .status(401).json({ msg: 'Not authorized: no token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

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


exports.authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user){
            return res
            .status(401).json({ msg: 'Not authorized: no user on request.'});
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Forbidden'});
        }
        next();
    };
};