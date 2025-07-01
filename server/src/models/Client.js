const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name:{ type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { street: String, city: String, postalCode: String, country: String},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);