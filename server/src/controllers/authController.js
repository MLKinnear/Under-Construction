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
        const { name, email, password, role, managerKey } = req.body;

        let managerId = null;
        if (role === 'worker'){
            if(!managerKey) {
                return res.status(400).json({ msg: 'managerKey is required for workers.'});
            }
            const manager = await User.findOne({ accessKey: managerKey });
            if (!manager || manager.role !== 'manager'){
                return res.status(400).json({ msg: 'Invalid managerKey.'});
            }
            managerId = manager._id;
        }

        const user = await User.create({ name, email, password, role, manager: managerId });
        const token = signToken(user);
        res.status(201).json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error.'});
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
            return res.status(400).json({ msg: 'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials'});
        }
        const token = signToken(user);
        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error.'});
    }
};