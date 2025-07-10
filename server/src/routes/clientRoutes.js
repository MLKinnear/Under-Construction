const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} = require('../controllers/clientController');

router.use(protect);

router.route('/')
    .get(authorize('manager'), getClients)
    .post(authorize('worker','manager'), createClient);

router.route('/:id')
    .get(authorize('manager'), getClientById)
    .put(authorize('manager'), updateClient)
    .delete(authorize('manager'), deleteClient);

module.exports = router;