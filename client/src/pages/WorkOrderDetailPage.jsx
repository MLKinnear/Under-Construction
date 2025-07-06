import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';

export default function WorkOrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [order, setOrder] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try{
                const { data } = await axios.get(`/api/workorders/${id}`, {
                    headers: { Authorization: `Bearer ${token}`}
                });
                setOrder(data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to load work order');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, token]);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const res = await axios.get('/api/users/workers',
                    { headers: { Authorization: `Bearer ${token}` }}
                );
                const list = Array.isArray(res.data.data) ? res.data.data : [];
                setWorkers(list);
            } catch (err) {
            console.error('Error loading workers:', err);
            }
        };
        fetchWorkers();
    },[token])

    const deleteTask = async (idx) => {
        try {
            await axios.delete(`/api/workorders/${id}/tasks/${idx}`,
                { headers: { Authorization: `Bearer ${token}` }}
            );
            const { data } = await axios.get(`/api/workorders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrder(data);
        } catch (err) {
        console.error('Failed to delete task:', err);
        }         
    };

    const saveTask = async (idx, updatedTask) => {
        const payload = {
            description: updatedTask.description,
            timeEstimate: updatedTask.timeEstimate,
            notes: updatedTask.notes ?? updatedTask.notes ?? '',
            state: updatedTask.state,
            assignedTo: updatedTask.assignedTo || null,
        };
        try{
            await axios.put(`/api/workorders/${id}/tasks/${idx}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const { data } = await axios.get(`/api/workorders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrder(data);
        }catch (err) {
            console.error('Failed to update task:', err);
        }
    };

    if (loading) return <p>Loading work order...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!order) return <p>Work order not found.</p>;

    const { number, state, promised, client } = order;

    return (
        <div className="container mx-auto p-6">
            <button onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            ← Back
            </button>

            <h1 className="text-3xl font-semibold mb-4">Work Order #{number}</h1>

            <h2 className="text-2xl font-semibold mb-2">Client Info</h2>
            {client ? (
                <div className="border p-4 rounded shadow-sm bg-white">
                    <p><strong>Name:</strong> {client.name}</p>
                    <p><strong>Email:</strong> {client.email}</p>
                    <p><strong>Phone:</strong> {client.phone || '—'}</p>
                    {/* add any other client fields here */}
                </div>
            ) : (
                <p>No client information available.</p>
            )}

            <div className="mb-6 space-y-2">
                <p><strong>State:</strong> {state}</p>
                <p><strong>Start Date:</strong>{' '}
                {promised.start ? new Date(promised.start).toLocaleString() : '—'}
                </p>
                <p><strong>Promised Date:</strong>{' '}
                {promised.by ? new Date(promised.by).toLocaleString() : '—'}
                </p>
                {order.notes && (
                <p><strong>Notes:</strong> {order.notes}</p>)}
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-2">Tasks</h2>

            {order.tasks.map((t, i) => (
                <TaskCard
                key={i}
                task={t}
                workers={workers}
                readOnly={false}
                onSave={(updated) => saveTask(i, updated)}
                onRemove={() => deleteTask(i)}
                />
            ))}
        </div>
    );
}