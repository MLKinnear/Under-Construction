const Note = require('../models/Note');

//GET /api/notes
exports.getNotes = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'manager' ) {
            filter.createdBy = req.user._id;
        } else {
            if (!req.user.manager) {
                return res
                    .status(400)
                    .json({ msg: 'No manager assigned to this worker.'});
            }

        filter = {
            createdBy: req.user.manager,
            showToWorkers: true
        };
        }
        const notes = await Note.find(filter)
            .sort({ pinned: -1, createdAt: -1});
        res.json(notes);
        } catch (err) {
            console.error('Error in getNotes:', err);
            res.status(500).json({ msg: err.msg});
        }
};

//POST /api/notes
exports.createNote = async (req, res) => {
    const { description, content, showToWorkers, pinned } = req.body;
    try {
        const note = new Note({
            description,
            content,
            showToWorkers,
            pinned,
            createdBy: req.user._id
        });
        const created = await note.save();
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

//PUT /api/notes/:id
exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note)
        return res.status(404).json({ msg: 'Note not found' });

        if (note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: not your note' });
        }

        ['description','content','showToWorkers','pinned']
        .forEach(field => {
        if (req.body[field] !== undefined) note[field] = req.body[field];
        });
        const updated = await note.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

//DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);
        if (!note) {
        return res.status(404).json({ msg: 'Note not found' });
        }

        if (note.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Forbidden: not your note' });
        }

        await note.remove();
        return res.json({ msg: 'Note removed' });
    } catch (err) {
        console.error('Error in deleteNote:', err);
        return res.status(500).json({ msg: err.message });
    }
};