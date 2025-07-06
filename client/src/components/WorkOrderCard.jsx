import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function WorkOrderCard({order}) {
    const { _id, promised, state, client: clientId } = order;
    const [clientName, setClientName] = useState('');

    useEffect(() => {
        axios.get(`/api/clients/${clientId}`)
        .then(res => setClientName(res.data.name))
        .catch(() => setClientName('Unknown'));
    }, [clientId]);
    
    return (
        <Link to={`/workorders/${_id}`} className='p-4 border rounded shadow hover:shadow-lg'>
            <p><strong>WO #:</strong> {order.number}</p>
            <p><strong>Name:</strong> {clientName || 'Loading…'}</p>
            <p><strong>Status:</strong> {state}</p>

            <p><strong>Start Date:</strong>{' '}
            {promised.start ? new Date(promised.start).toLocaleString() : '-'}
            </p>

            <p><strong>Promised Date:</strong>{' '}
            {promised.by ? new Date(promised.by).toLocaleString() : '-'}
            </p>
        </Link>
    )
}