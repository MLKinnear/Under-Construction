const express = require('express');
const cors = require('cors');
const { protect, authorize } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const clientRoutes = require('./routes/clientRoutes');
const workorderRoutes = require('./routes/workorderRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    process.env.CLIENT_URL
];

app.use(cors({
    origin: (incomingOrigin, callback) => {
        if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: blocked origin ${incomingOrigin}`));
        }
    },
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/users', protect, userRoutes);

app.use('/api/clients', clientRoutes);

app.use('/api/workorders', protect, authorize('worker', 'manager'), workorderRoutes);

app.use('/api/notes', noteRoutes);

app.listen(5000, () => console.log('API listening on port 5000'));

module.exports = app;