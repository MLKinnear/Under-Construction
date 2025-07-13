import React from 'react';
import { Link } from 'react-router-dom';

export default function WorkOrderCard({order, layout}) {
    const { _id, promised, state, tasks, number, client } = order;

    const workerNames = Array.from(
        new Set(
            tasks
                .map(task => task.assignedTo?.name)
                .filter(Boolean)
        )
    );

    const assignedText = workerNames.length > 0 ? workerNames.join(', ') : 'Unassigned';
    
    return (
        <Link to={`/workorders/${_id}`}>
            <div
                className={`flex flex-col m-4 p-5 gap-4 shadow-lg rounded-lg bg-white
                    ${layout === 'grid' ? 'min-w-[300px]' : 'w-full'}`}
            >
                <p className='text-lg font-semibold'>Work Order #: {number}</p>
                <p className='text-lg font-semibold'>{client?.name || 'Unknown'}</p>
                <p className='text-sm font-semibold'>Status: {state}</p>
                <p className='text-sm font-semibold'>
                    Start Date: {promised.start ? new Date(promised.start).toLocaleString() : '-'}
                </p>
                <p className='text-sm font-semibold'>
                    Promised Date: {promised.by ? new Date(promised.by).toLocaleString() : '-'}
                </p>
                <p className='text-sm font-semibold'>Assigned Worker: {assignedText}</p>
            </div>
        </Link>
    );
}
