const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getNextNumber,
    createWO,
    listByClient,
    getOneWO,
    updateWO,
    addTask,
    removeTask
} = require('../controllers/workorderController');

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

// POST /api/workorders/:id/tasks
router.post('/:id/tasks', protect, addTask);

// DELETE /api/workorders/:id/task/:index
router.delete('/:id/tasks/:taskIndex', protect, removeTask);

module.exports = router;