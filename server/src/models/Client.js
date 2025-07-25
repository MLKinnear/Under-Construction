const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name:{ type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true},
    address: { street: String, city: String, postalCode: String, province: String, country: String},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);