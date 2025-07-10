import React from 'react';
import TaskCard from './TaskCard';

export default function WorkOrderTaskList({ tasks, workers, saveTask, deleteTask, userRole, currentUserId }) {

    return (
        <div>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Tasks</h2>
            {tasks.length === 0 ? (
                <p className="italic text-gray-500">No tasks yet</p>
            ) : (
                tasks.map((task, idx) => {
                    const isManager = userRole === 'manager';
                    const assignedId = task.assignedTo && (
                        typeof task.assignedTo === 'object'
                            ? task.assignedTo._id
                            : task.assignedTo
                    );
                    const isOwner = userRole === 'worker' && assignedId === currentUserId;

                    const fieldsEditable = {
                        description: isManager,
                        timeEstimate: isManager,
                        assignedTo: isManager,
                        notes: isManager || isOwner,
                        state: isManager || isOwner,
                    };

                return (
                <TaskCard
                    key={idx}
                    task={task}
                    workers={workers}
                    fieldsEditable={fieldsEditable}
                    onSave={updated => saveTask(idx, updated)}
                    onRemove={isManager ? () => deleteTask(idx) : undefined}
                />
                );
                })
            )}
        </div>
    );
}