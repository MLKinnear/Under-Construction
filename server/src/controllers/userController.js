const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
// Gets all workers under current manager
// GET /api/users/workers
exports.getWorkers = async (req, res) => {
    try{
        const workers = await User.find({ manager: req.user._id })
        .select('name email createdAt');
        res.json({ success: true, count: workers.length, data: workers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error'});
    }
};

// GET /api/users/profile
exports.getProfile = async (req, res) => {
    try {
        const query = User.findById(req.user.id).select('-password');
        if(req.user.role === 'worker') {
            query.populate('manager', 'name');
        }
        const user = await query;
        if (!user) return res.status(404).json({ error: 'User not found'});

        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessKey: user.accessKey
        };
        if (user.role === 'worker') {
            payload.managerName = user.manager?.name;
        }

        res.json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
};

// PUT /api/users/profile

exports.updateProfile = async (req, res) => {
    const { name, email, password: rawPassword } = req.body;
    const password = rawPassword?.trim();
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found'});

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = password;
        }
        const updated = await user.save();

        return res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            accessKey: updated.accessKey
        });
    } catch (err) {
        console.error('Profile update failed:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message).join('; ');
            return res.status(400).json({ error: messages });
        }
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({ error: `${field} already in use.` });
        }
        res.status(400).json({ error: err.message || 'Invalid data' });
    }
};

// PUT /api/users/profile/rotate-key
exports.rotateAccessKey = async (req, res) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    try {
        const user = await User.findById(req.user.id);
        const newKey = crypto.randomBytes(16).toString('hex');
        user.accessKey = newKey;
        await user.save();
        res.json({ accessKey: newKey });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not rotate key' });
    }
};