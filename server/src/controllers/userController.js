const User = require('../models/User');
// Gets all workers under current manager
// GET /api/users/workers
// manager only
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

// Rotate manager's access key
// POST /api/users/access-key/rotate
// manager only
exports.rotateKey = async (req, res) => {
    try{
        const newKey = await req.user.rotateAccessKey();
        res.json({ success: true, accessKey: newKey});
    }catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message });
    }
};