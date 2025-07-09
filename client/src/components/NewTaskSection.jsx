import React, { useState } from 'react'
import TaskCard from './TaskCard'

export default function NewTaskSection({ workers, onAdd}) {
    const [task, setTask] = useState({
        description: '',
        timeEstimate: 0,
        notes: '',
        state: 'OPEN',
        assignedTo: null,
    })

    const handleSave = updated => {
        onAdd(updated)

        setTask({
            description: '',
            timeEstimate: 0,
            notes: '',
            state: 'OPEN',
            assignedTo: null,
        })
    }

    const handleCancel = () => {
        setTask({
            description: '',
            timeEstimate: 0,
            notes: '',
            state: 'OPEN',
            assignedTo: null,
        })
    }

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded shadow-xl">
            <h4 className="font-semibold mb-2">New Task</h4>
            <TaskCard
                task={task}
                workers={workers}
                readOnly={false}
                onSave={handleSave}
                onRemove={handleCancel}
            />
        </div>
    )
}