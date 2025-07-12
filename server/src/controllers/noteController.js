const Note = require('../models/Note');

//GET /api/notes
exports.getNotes = async (req, res) => {
    try {
        const filter = req.user.role === 'worker'
            ? { showToWorkers: true }: {};
        const notes = await Note.find(filter)
            .sort({ pinned: -1, createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ msg: err.message });
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
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        await note.remove();
        res.json({ msg: 'Note removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};