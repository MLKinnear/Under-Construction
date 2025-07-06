const WorkOrder = require('../models/WorkOrder');

exports.getNextNumber = async (req, res, next) => {
    const managerId = req.user._id;
    const last = await WorkOrder
        .find({ manager: managerId })
        .sort({ number: -1 })
        .limit(1)
        .select('number')
        .lean();
    res.json({ next: last.length ? last[0].number + 1 : 100 });
}

exports.createWO = async (req, res, next) => {
    try {
        const managerId = req.user._id;

        // finding the last work order number
        const last = await WorkOrder
        .find({ manager: managerId })
        .sort({ number: -1 })
        .limit(1)
        .select('number')
        .lean()

        // work order numbers start at 100
        const nextNumber = last.length === 0 ? 100 : last[0].number + 1;

        const wo = new WorkOrder({ ...req.body, manager: managerId, number: nextNumber });
        await wo.save();
        res.status(201).json(wo);
    } catch (err) {
        next(err);
    }
};

exports.listByClient = async (req, res, next) => {
    try {
        const list = await WorkOrder
        .find({ client: req.params.clientId })
        .sort('-createdAt');
        res.json(list);
    } catch (err) {
        next(err);
    }
};

exports.getOneWO = async (req, res, next) => {
    try {
        const wo = await WorkOrder
        .findById(req.params.id)
        .populate('client');
        if (!wo) return res.status(404).sent('Work Order not found');
        res.json(wo);
    } catch (err) {
        next(err);
    }
};

exports.updateWO = async (req, res, next) => {
    try {
        const wo = await WorkOrder.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(wo);
    } catch (err) {
        next(err);
    }
};

exports.addTask = async (req, res, next) => {
    try {
        const { description, timeEstimate } = req.body;
        const wo = await WorkOrder.findByIdAndUpdate(
            req.params.id,
            { $push: { tasks: { description, timeEstimate }}},
            { new: true }
        );
        res.json(wo);
    } catch (err) {
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    try{
        const { description, timeEstimate, notes, state, assignedTo } = req.body;
        const idx = parseInt(req.params.taskIndex, 10);
        const wo = await WorkOrder.findById(req.params.id);
        if (!wo) return res.status(404).json({ msg: 'Work order not found'});

        const task = wo.tasks[idx];
        task.description = description;
        task.timeEstimate = timeEstimate;
        task.notes = notes;
        task.state = state;
        task.assignedTo = assignedTo || null;

        await wo.save();
        return res.json(wo);
    }catch (err) {
        next(err);
    }
};

exports.removeTask = async (req, res, next) => {
    try{
        const idx = parseInt(req.params.taskIndex, 10);
        const wo = await WorkOrder.findById(req.params.id);
        wo.tasks.splice(idx, 1);
        await wo.save();
    res.json(wo);
    } catch (err){
        next(err);
    }
};