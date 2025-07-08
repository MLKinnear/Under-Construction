import React from 'react';
import TaskCard from './TaskCard';

export default function WorkOrderTaskList({ tasks, workers, saveTask, deleteTask }) {

    const handleRemove = idx => {
        if (window.confirm('Are you sure you want to delete this task?')) {
        deleteTask(idx);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Tasks</h2>
            {tasks.length === 0 ? (
                <p className="italic text-gray-500">No tasks yet</p>
            ) : (
                tasks.map((task, idx) => (
                <TaskCard
                    key={idx}
                    task={task}
                    workers={workers}
                    readOnly={false}
                    onSave={updated => saveTask(idx, updated)}
                    onRemove={() => handleRemove(idx)}
                />
                ))
            )}
        </div>
    );
}