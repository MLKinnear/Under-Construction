import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';

export default function NoteCard({ note, isManager, onUpdate, onDelete }) {
    const { _id, description, content, showToWorkers, pinned } = note;
    const [editing, setEditing] = useState(false);
    const [data, setData] = useState({ description, content, showToWorkers, pinned });

    const handleChange = e => {
        const { name, type, checked, value } = e.target;
        setData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value
        }));
    };

    const save = () => {
        onUpdate(_id, data);
        setEditing(false);
    };

    return (
        <div className={`bg-white p-4 rounded shadow ${pinned ? 'border-l-4 border-yellow-400' : ''}`}>
            {editing ? (
                <>
                    <input
                        id='description'
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        className="w-full border rounded mb-2 p-2"
                    />
                    <textarea
                        id='content'
                        name="content"
                        value={data.content}
                        onChange={handleChange}
                        className="w-full border rounded mb-2 p-2"
                    />
                    <div className="flex space-x-4 mb-2">
                        <label className="inline-flex items-center">
                        <input
                            id='workerVisible'
                            type="checkbox"
                            name="showToWorkers"
                            checked={data.showToWorkers}
                            onChange={handleChange}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Visible to workers</span>
                        </label>
                        <label className="inline-flex items-center">
                        <input
                            id='pinned'
                            type="checkbox"
                            name="pinned"
                            checked={data.pinned}
                            onChange={handleChange}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Pinned</span>
                        </label>
                    </div>
                    <button onClick={save} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                        Save
                    </button>
                    <button onClick={() => setEditing(false)} className="bg-gray-300 px-3 py-1 rounded">
                        Cancel
                    </button>
                    </>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-lg">{description}</h3>
                            {showToWorkers && (
                                <UserIcon className="h-5 w-5 text-gray-500" title="Visible to workers" />
                            )}
                        </div>
                        {pinned && <span>📌</span>}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{content}</p>
                    {isManager && (
                        <div className="mt-4 space-x-4">
                        <button onClick={() => setEditing(true)} className="text-blue-500">
                            Edit
                        </button>
                        <button onClick={() => onDelete(_id)} className="text-red-500">
                            Delete
                        </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}