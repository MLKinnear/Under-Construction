const mongoose = require('mongoose');
const { Schema, Types } = mongoose;


const TaskSchema = new Schema ({
    description: { type: String, required: true },
    timeEstimate: { type: Number, required: true },
    notes: { type: String},
    state: {
        type: String,
        enum: ['OPEN', 'ON HOLD', 'IN PROGRESS', 'IN REVIEW', 'COMPLETED'],
        default: 'OPEN'
        },
    assignedTo: { type: Types.ObjectId, ref: 'User' }
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
        default: 'OPEN'
    }
}, {toJSON: { 
    virtuals: true,
    transform(doc, ret) {
        ret.number = String(ret.number).padStart(6, '0');
        delete ret.paddedNumber;
        return ret;
    }
    }, toObject: { virtuals: true}}, { timestamps: true });

WorkOrderSchema.index({ manager: 1, number: 1 }, { unique: true }),

module.exports = mongoose.model('WorkOrder', WorkOrderSchema );