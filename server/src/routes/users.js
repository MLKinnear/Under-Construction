const router =  require('express').Router();
const { authorize } = require('../middleware/auth');
const { getWorkers, rotateKey } = require('../controllers/userController');

// Managers list their workers
// GET /api/users/workers
// Managers only
router.get('/workers', authorize('manager'), getWorkers);

// Managers rotate their key
// POST /api/users/access-key/rotate
// Managers only
router.post('/access-key/rotate', authorize('manager'), rotateKey);

module.exports = router;