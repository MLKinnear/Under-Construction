import React from 'react';
import { Link } from 'react-router-dom';

export default function WorkOrderCard({order}) {
    const { _id, promised, state } = order;
    return (
        <Link to={`/workorders/${_id}`} className='p-4 border rounded shadow hover:shadow-lg'>
            <p><strong>WO #:</strong> {order.number}</p>
            <p><strong>State:</strong> {state}</p>

            <p><strong>Start Date:</strong>{' '}
            {promised.start ? new Date(promised.start).toLocaleString() : '-'}
            </p>

            <p><strong>Promised Date:</strong>{' '}
            {promised.by ? new Date(promised.by).toLocaleString() : '-'}
            </p>
        </Link>
    )
}