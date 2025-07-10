const router =  require('express').Router();
const { authorize, protect } = require('../middleware/auth');
const {
    getWorkers,
    getProfile,
    updateProfile,
    rotateAccessKey,
    rotateKey
} = require('../controllers/userController');

router.use(protect);

// Managers list their workers
// GET /api/users/workers
// Managers only
router.get('/workers', authorize('manager'), getWorkers);

// Profile
router
    .route('/profile')
    .get(getProfile)
    .put(updateProfile);

// Managers rotate their key
router
    .route('/profile/rotate-key')
    .put(authorize('manager'), rotateAccessKey);

module.exports = router;