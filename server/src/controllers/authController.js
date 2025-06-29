const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const signToken = user =>
    jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h'}
    );

// Register new user (manager or worker)
// POST /api/auth/register
// all can access
exports.register = async (req, res) => {
    try{
        const { name, email, password, role, managerKey, productKey } = req.body;

        let managerId = null;

        if(role === 'manager'){
            if(!productKey || productKey !== process.env.PRODUCT_KEY) {
                return res
                .status(400)
                .json({ message: 'Invalid product key, try again'})
            }
        }

        if (role === 'worker'){
            if(!managerKey) {
                return res.status(400).json({ message: 'managerKey is required for workers.'});
            }
            const manager = await User.findOne({ accessKey: managerKey });
            if (!manager || manager.role !== 'manager'){
                return res.status(400).json({ message: 'Invalid managerKey.'});
            }
            managerId = manager._id;
        }

        const user = await User.create({ name, email, password, role, manager: managerId });
        const token = signToken(user);
        user.password = undefined;
        return res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessKey: user.accessKey || null,
                manager: user.manager || null
        },
            token
        });
    } catch (err) {
        if(err.code === 11000 && err.keyPattern){
            if (err.keyPattern.email){
            return res.status(400).json({ message:'That email is already in use.' })};
        }
        res.status(500).json({ message: 'Server error.'});
    }
};

// Login User
// POST /api/auth/login
// all can access
exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials'});
        }
        const token = signToken(user);
        user.password = undefined;
        res.json({ user, token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.'});
    }
};