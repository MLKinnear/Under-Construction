import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import WorkOrderDetailCard from '../components/WorkOrderDetailCard';
import WorkOrderTaskList from '../components/WorkOrderTaskList';

export default function WorkOrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [order, setOrder] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [details, setDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        try{
            const { data } = await axios.get(`/api/workorders/${id}`, {
                headers: { Authorization: `Bearer ${token}`}
            });
            setOrder(data);
            setDetails({
                altContact: data.altContact || { name: '', phone: '', address: ''},
                promised: data.promised || { start: '', by: ''},
                notes: data.notes || '',
                state: data.state || 'OPEN',
            });
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to load work order');
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {fetchOrder();}, [fetchOrder]);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const res = await axios.get('/api/users/workers',
                    { headers: { Authorization: `Bearer ${token}` }}
                );
                setWorkers(Array.isArray(res.data.data) ? res.data.data : []);
            } catch (err) {
            console.error('Error loading workers:', err);
            }
        };
        fetchWorkers();
    },[token])

    const saveDetails = async () => {
        try {
            const payload = {
                altContact: details.altContact,
                promised: details.promised,
                notes: details.notes,
                state: details.state,
            };
            await axios.put(`/api/workorders/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}`},
            });
            setIsEditing(false);
            fetchOrder();
        } catch (err) {
            console.error('Failed to save details', err);
        }
    };

    const deleteTask = async idx => {
        try {
            await axios.delete(`/api/workorders/${id}/tasks/${idx}`,
                { headers: { Authorization: `Bearer ${token}` },
        });
            fetchOrder();
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
            fetchOrder();
        } catch (err) {
            console.error('Failed to save task:', err);
        }
    };

    if (loading) return <p>Loading work order...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!order) return <p>Work order not found.</p>;

    return (
        <div className="container mx-auto p-6">
            <button onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            ← Back
            </button>

            <h1 className="text-3xl font-semibold mb-4">Work Order #{order.number}</h1>

            {/* Client Info Section */}
            <h2 className="text-2xl font-semibold mb-2">Client Info</h2>
            <div className="border p-4 rounded shadow-sm bg-white mb-6">
                <p><strong>Name:</strong> {order.client.name}</p>
                <p><strong>Email:</strong> {order.client.email}</p>
                <p><strong>Phone:</strong> {order.client.phone || '—'}</p>
                {order.client.address && (
                <p><strong>Address:</strong> {order.client.address.street}, {order.client.address.city}</p>
                )}
            </div>
            
            {/* Details and Tasks Split */}
            <WorkOrderDetailCard
                details={details}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                saveDetails={saveDetails}
                order={order}
                setDetails={setDetails}
            />

            <WorkOrderTaskList
                tasks={order.tasks}
                workers={workers}
                saveTask={saveTask}
                deleteTask={deleteTask}
            />
        </div>
    );
}