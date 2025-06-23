const express = require('express');
const { protect, authorize } = require('./middleware/auth');
const authRouters = require('./routes/auth');
const userRouters = require('./routes/users');

const app = express();
app.use(express.json());

app.use('/api/auth', authRouters);

app.use('/api/users', protect, userRouters);

module.exports = app;