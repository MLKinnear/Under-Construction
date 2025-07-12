const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const {
    getNotes,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController');

const router = express.Router();

router
    .route('/')
    .get(protect, getNotes)
    .post(protect, authorize('manager'), createNote);

router
    .route('/:id')
    .put(protect, authorize('manager'), updateNote)
    .delete(protect, authorize('manager'), deleteNote);

module.exports = router;