const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    description:{ type: String, required: true },
    content:{ type: String, required: true },
    showToWorkers:{ type: Boolean, default: false },
    pinned:{ type: Boolean, default: false },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true});

module.exports = mongoose.model('Note', noteSchema);