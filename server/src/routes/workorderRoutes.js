const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const WorkOrder = require('../models/WorkOrder');
const {
    getNextNumber,
    createWO,
    listByClient,
    getOneWO,
    updateWO,
    addTask,
    updateTask,
    removeTask
} = require('../controllers/workorderController');

router.get('/', protect, async (req, res) => {
    try {
        const orders = await WorkOrder.find({ manager: req. user._id });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error'});
    }
});


// GET Work Order number before creating
router.get('/next-number', protect, getNextNumber);

// POST Create new work order
router.post('/', protect, createWO);

// GET List work orders for a given client
router.get('/clients/:clientId', protect, listByClient);

// GET Single work order by ID
router.get('/:id', protect, getOneWO);

// PUT Update an existing work order
router.put('/:id', protect, updateWO);

// POST Adds a tasl
router.post('/:id/tasks', protect, addTask);

// PUT Update a specific task
router.put('/:id/tasks/:taskIndex', protect, updateTask);

// DELETE Deletes a specific task
router.delete('/:id/tasks/:taskIndex', protect, removeTask);

module.exports = router;