import React, { useState, useEffect } from "react";

export default function TaskCard({
    task,
    workers = [],
    onSave,
    onRemove,
    readOnly,
    fieldsEditable,
}) {

    const [localTask, setLocalTask] = useState(task);
    const [showError, setShowError] = useState(false);
    
    useEffect(() => {
        setLocalTask(task);
        setShowError(false);
    }, [task]);

    const isDirty = JSON.stringify(localTask) !== JSON.stringify(task);
    const isDescriptionValid = localTask.description.trim() !== "";

    const fe = fieldsEditable ? fieldsEditable : {
        description: !readOnly,
        timeEstimate: !readOnly,
        notes: !readOnly,
        state: !readOnly,
        assignedTo: !readOnly,
    };

    const getAssignedId = assigned => {
        if (!assigned) return '';
        return typeof assigned === 'object' ? assigned._id : assigned;
    }

    const anyEditable = Object.values(fe).some(Boolean);

    const handleFieldChange = (field, value) => {
        setLocalTask(prev => ({ ...prev, [field]: value }));
        if (field === 'description' && showError) {
            setShowError(value.trim() === '');
        }
    };

    const handleSaveClick = () => {
        if (!isDescriptionValid){
            setShowError(true);
            return;
        }
        onSave(localTask)
    }

    return (
        <div className="border p-4 rounded bg-white mb-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        className="w-full"
                        disabled={!fe.description}
                        value={localTask.description}
                        onChange={e => handleFieldChange('description', e.target.value)}
                        onBlur={() => setShowError(!isDescriptionValid)}
                        autoComplete="off"
                    />
                    {showError && (
                        <p className="text-red-600 text-sm mt-1">
                            A description is required!
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="duration">Time Estimate (hrs)</label>
                    <input
                        id="duration"
                        type="number"
                        className="w-full"
                        disabled={!fe.timeEstimate}
                        value={localTask.timeEstimate}
                        onChange={e => handleFieldChange('timeEstimate', e.target.value)}
                        autoComplete="off"
                    />
                </div>
            </div>

            <div className="mt-2">
                <label htmlFor="note">Note</label>
                <textarea
                    id="note"
                    className="w-full"
                    disabled={!fe.notes}
                    value={localTask.notes || ''}
                    onChange={e => handleFieldChange('notes', e.target.value)}
                    autoComplete="off"
                    />
            </div>

            <div className="flex gap-4 mt-2">
                <div>
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        className="block"
                        disabled={!fe.state}
                        value={localTask.state}
                        onChange={e => handleFieldChange('state', e.target.value)}
                        autoComplete="off"
                    >
                        {['OPEN','ON HOLD','IN PROGRESS','IN REVIEW','COMPLETED']
                        .map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="assignedTo">Assigned To</label>
                    {fe.assignedTo ? (
                    <select
                        id="assignedTo"
                        className="block"
                        disabled={!fe.assignedTo}
                        value={getAssignedId(localTask.assignedTo)}
                        autoComplete="off"
                        onChange={e =>
                        handleFieldChange(
                            'assignedTo',
                            e.target.value ? e.target.value : null
                        )
                        }
                    >
                        <option value="">— Unassigned —</option>
                        {workers.map(w => (
                        <option key={w._id} value={w._id}>
                            {w.name}
                        </option>
                        ))}
                    </select>
                    ) : (
                    <p className="mt-1">
                        {typeof task.assignedTo === 'object'
                        ? task.assignedTo.name
                        : '—'}
                    </p>
                    )}
                </div>
            </div>

            {(anyEditable || onRemove) && (
                <div className="flex gap-2 mt-4">
                    {anyEditable && (
                        <>
                            <button
                                onClick={handleSaveClick}
                                disabled={!isDirty || !isDescriptionValid}
                                className={`px-4 py-1 rounded text-white ${
                                    isDirty && isDescriptionValid
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-gray-300 cursor-not-allowed"
                                }`}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setLocalTask(task)
                                    setShowError(false);
                                }}
                                disabled={!isDirty}
                                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                        </>
                    )}
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Remove
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}