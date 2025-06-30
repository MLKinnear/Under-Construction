const router = require('express').Router();
const { register, login } = require('../controllers/authController');

//POST /api/auth/register
router.post('/register', register);

//POST /api/aut/login
router.post('/login', login);

module.exports = router;