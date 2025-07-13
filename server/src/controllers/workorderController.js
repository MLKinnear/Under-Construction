const WorkOrder = require('../models/WorkOrder');

exports.getNextNumber = async (req, res, next) => {
    const managerId = req.user._id;
    const last = await WorkOrder
        .find({ manager: managerId })
        .sort({ number: -1 })
        .limit(1)
        .select('number')
        .lean();
    const rawNext = last.length ? last[0].number + 1 : 100;
    const nextPadded = String(rawNext).padStart(6, '0');
    res.json({ next: nextPadded });
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
        const filter = { client: req.params.clientId };

        if(req.user.role === 'worker') {
            filter.assignedTo = req.user._id;
        }

        const list = await WorkOrder.find(filter).sort('-createdAt');
        res.json(list);
    } catch (err) {
        next(err);
    }
};

exports.getOneWO = async (req, res, next) => {
    try {
        const filter = {_id: req.params.id };

        if (req.user.role === 'worker') {
            filter['tasks.assignedTo'] = req.user._id;
        }

        const wo = await WorkOrder.findOne(filter)
            .populate('client')
            .populate({
                path: 'tasks.assignedTo',
                select: 'name'
            });
        if (!wo) {
            return res.status(404).json({ msg: 'No Work Order found or authorized'});
        }
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
        const { notes, state } = req.body;
        const idx = parseInt(req.params.taskIndex, 10);
        const wo = await WorkOrder.findById(req.params.id);
        if (!wo) return res.status(404).json({ msg: 'Work order not found'});

        const task = wo.tasks[idx];
        if(!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (req.user.role === 'manager'){
            ['description','timeEstimate','notes','state','assignedTo']
            .forEach(f => {
                if (req.body[f] !== undefined) {
                    task[f] = req.body[f];
                }
            });
        } else if (req.user.role === 'worker') {
            if (!task.assignedTo ||
                task.assignedTo.toString() !== req.user._id.toString()
            ) {
                return res.status(403).json({ msg: 'Forbidden' });
            }

            if (req.body.notes  !== undefined) task.notes  = req.body.notes;
            if (req.body.state  !== undefined) task.state  = req.body.state;

        } else {
            return res.status(403).json({ msg: 'Forbidden' });
        }

        await wo.save();
        return res.json(wo);

    }catch (err) {
        console.error('updateTask error:', err);
        return res.status(500).json({ msg: 'Server error: ' + err.message });
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