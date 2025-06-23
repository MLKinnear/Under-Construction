const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['manager', 'worker'],
        default: 'worker'
    },

    // only if role==='manager'
    accessKey: {
        type: String,
        unique: true,
        sparse: true
    },

    // only if role==='worker'
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
});

// hash passwords with bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//generates manager access key
userSchema.pre('save', function(next) {
    if (this.role ==='manager' && !this.accessKey) {
        this.accessKey = crypto.randomBytes(16).toString('hex');
    }
    next();
});

//method for managers to "rotate" access key
userSchema.methods.rotateAccessKey = async function () {
    if(this.role !=='manager'){
        throw new Error('Only managers have access keys');
    }
    this.accessKey = crypto.randomBytes(16).toString('hex');
    await this.save();
    return this.accessKey;
};

module.exports = mongoose.model('User', userSchema);