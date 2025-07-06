const mongoose = require('mongoose');
const { Schema, Types } = mongoose;


const TaskSchema = new Schema ({
    description: { type: String, required: true },
    timeEstimate: { type: Number, required: true }
}, { _id: false }, { timestamps: true });

const WorkOrderSchema = new Schema ({
    client: { type: Types.ObjectId, ref: 'Client', required: true },
    manager: { type: Types.ObjectId, ref: 'User', required: true},
    number: { type: Number, required: true },
    altContact: {
        name: { type: String },
        phone: { type: String },
        address: { type: String }
    },
    promised: {
        start: { type: Date },
        by: { type: Date }
    },
    tasks: [ TaskSchema ],
    notes: { type: String },
    state: {
        type: String,
        enum: ['OPEN', 'ON HOLD', 'IN PROGRESS', 'IN REVIEW', 'COMPLETED'],
        default: 'open'
    }
}, { timestamps: true });

WorkOrderSchema.index({ manager: 1, number: 1 }, { unique: true }),

module.exports = mongoose.model('WorkOrder', WorkOrderSchema );