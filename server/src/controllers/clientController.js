const { MongoWriteConcernError } = require('mongodb');
const Client = require('../models/Client');

//Get /api/clients
exports.getClients = async (req, res) => {
    try{
        const clients = await Client.find({ createdBy: req.user.id })
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: 'Server error'})
    }
};

//Get /api/clients/:id
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });
        if (!client) return res.status(404).json ({ error: 'Client not found'});
        res.json(client);
    } catch (err) {
        res.status(500).json({ error: 'Server error'});
    }
};

//Post /api/clients
exports.createClient = async (req, res) => {
    try {
        const newClient = new Client({
            ...req.body,
            createdBy: req.user.id
        });
        const client = await newClient.save();
        res.status(201).json(client);
    } catch (err) {
        res.status(400).json({ error:'Invalid data'});
    }
};

//Put /api/clients/:id
exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findOneAndUpdate(
            {_id: req.params.id, createdBy: req.user.id},
            req.body,
            { new: true, runValidators: true }
        );
        if (!client) return res.status(404).json({ error: 'Client not found'});
        res.json(client);
    } catch (err) {
        res.status(400).json({ error:'Invalid data'});
    }
};

//Delete /api/clients/:id
exports.deleteClient = async (req, res) => {
    try{
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id
        });
        if (!client) return res.status(404).json({ error: 'Client not found'});
        res.json({ message: 'Deleted!'})
    } catch (err) {
        res.status(500).json({ error: 'Server error'});
    }
};