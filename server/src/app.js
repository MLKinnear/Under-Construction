const express = require('express');
const cors = require('cors');
const { protect, authorize } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const clientRoutes = require('./routes/clientRoutes');
const workorderRoutes = require('./routes/workorderRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}))

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/users', protect, userRoutes);

app.use('/api/clients', clientRoutes);

app.use('/api/workorders', workorderRoutes);

app.listen(5000, () => console.log('API listening on port 5000'));

module.exports = app;