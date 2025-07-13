import React, { useState } from 'react';

export default function NewNoteForm({ onCreate }) {
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [showToWorkers, setShowToWorkers] = useState(false);
    const [pinned, setPinned] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        onCreate({ description, content, showToWorkers, pinned });
        setDescription('');
        setContent('');
        setShowToWorkers(false);
        setPinned(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
            <div className="mb-2">
                <label htmlFor="title" className="block font-medium">Title</label>
                <input
                    id='title'
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <div className="mb-2">
                <label htmlFor="content" className="block font-medium">Content</label>
                <textarea
                id='content'
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                className="w-full border rounded p-2"
                />
            </div>
            <div className="flex space-x-4 mb-2">
                <label htmlFor="workerVisible" className="inline-flex items-center">
                <input
                    id='workerVisible'
                    type="checkbox"
                    checked={showToWorkers}
                    onChange={e => setShowToWorkers(e.target.checked)}
                    className="form-checkbox"
                />
                <span className="ml-2">Visible to workers</span>
                </label>
                <label htmlFor="pinned" className="inline-flex items-center">
                <input
                    id='pinned'
                    type="checkbox"
                    checked={pinned}
                    onChange={e => setPinned(e.target.checked)}
                    className="form-checkbox"
                />
                <span className="ml-2">Pinned</span>
                </label>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Note
            </button>
        </form>
    );
}