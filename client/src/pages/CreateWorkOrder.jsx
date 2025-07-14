import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import NewTaskSection from '../components/NewTaskSection';

export default function CreateWorkOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [client, setClient] = useState(null);
    const [workers, setWorkers] = useState ([]);

    const [form, setForm] = useState({
        client: id,
        altContact: { name: '', phone: '', address: '' },
        promised: { start: '', by: '' },
        notes: '',
        state: 'OPEN',
        tasks: []
    });

    const [nextNumber, setNextNumber] = useState(null);

    useEffect(() => {
        api.get(`/clients/${id}`, { headers:{ Authorization:`Bearer ${token}` }})
            .then(r => setClient(r.data));
    }, [id, token]);

    useEffect(() => {
        api.get('/users/workers', { headers:{ Authorization:`Bearer ${token}` }})
            .then(res => {
            setWorkers(Array.isArray(res.data.data) ? res.data.data : []);
            })
            .catch(err => console.error(err));
    }, [token]);

    useEffect(() => {
        api.get(`/clients/${id}`, {headers: { Authorization: `Bearer ${token}`}})
        .then(res => setClient(res.data))
        .catch(err => console.error('Failed to load client', err));
    }, [id, token]);

    useEffect(() => {
        api.get('/workorders/next-number', { headers: { Authorization: `Bearer ${token}` }})
        .then(res => setNextNumber(res.data.next))
        .catch(err => console.error('Could not load next WO number', err));
    },[token])

    const handleChange = e => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [group, field] = name.split('.');
            setForm(f => ({ ...f, [group]: {...f[group], [field]: value }}));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        await api.post('/workorders', { ...form, number: nextNumber }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        navigate(`/clients/${id}`);
    }

    const removePendingTask = idx => {
        setForm(f => ({ ...f, tasks: f.tasks.filter((_,i) => i !== idx)}));
    };

    const savePendingTask = (idx, updated) => {
        setForm(f => {
            const tasks = [...f.tasks];
            tasks[idx] = updated;
            return { ...f, tasks };
        });
    };

    const addNewTask = updated => {
        setForm(f => ({ ...f, tasks: [...f.tasks, updated] }));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="flex justify-center text-4xl mb-4">Create Work Order</h1>
            <form className='flex justify-between m-1' onSubmit={handleSubmit}>
                <button onClick={() => navigate(-1)}
                    className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                    ← Back
                </button>
                <button type="submit"
                    className="mb-4 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">
                    Create Work Order
                </button>
            </form>
            {client && (
                <div>
                    {nextNumber !== null &&(
                        <div className="text-3xl font-semibold mb-4">
                            <label htmlFor="workorder" >Work Order #</label>
                            <input
                            id='workorder'
                            value={nextNumber}
                            disabled
                            autoComplete="off"
                            />
                        </div>
                    )}
                    <h2 className="text-2xl font-semibold mb-2">Client Info</h2>
                    <div className="border p-4 rounded shadow-sm bg-white mb-6">

                        <p><strong>Name:</strong> {client.name}</p>
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Phone:</strong> {client.phone || '—'}</p>
                        {client.address && (
                        <p><strong>Address:</strong> {client.address.street}, {client.address.city}</p>
                        )}
                    </div>
                </div>
            )}

            <form className="border p-4 rounded shadow-sm bg-white mb-6">

                <div className="space-y-4">
                    <div>
                        <p>Additional Contact Information:</p>
                        <label htmlFor="name" className="block font-medium">Name</label>
                        <input
                            id='name'
                            name='altContact.name'
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                            value={form.altContact.name}
                            autoComplete="off"
                        />
                        <label htmlFor="phone" className="block font-medium">Phone</label>
                        <input
                            id='phone'
                            name='altContact.phone'
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                            value={form.altContact.phone}
                            autoComplete="off"
                        />
                        <label htmlFor="address" className="block font-medium">Address</label>
                        <input
                            id='address'
                            name='altContact.address'
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                            value={form.altContact.address}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label htmlFor="start" className="block font-medium">Start Date</label>
                        <input
                            id='start'
                            type='datetime-local'
                            className="w-full border p-2 rounded"
                            name='promised.start'
                            onChange={handleChange}
                            value={form.promised.start}
                            autoComplete="off"
                        />
                        <label htmlFor="end" className="block font-medium">Promised Date</label>
                        <input
                            id='end'
                            type='datetime-local'
                            className="w-full border p-2 rounded"
                            name='promised.by'
                            onChange={handleChange}
                            value={form.promised.by}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block font-medium">Work Order Notes</label>
                        <textarea
                            id='notes'
                            name='notes'
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                            value={form.notes}
                            autoComplete="off"
                        />
                        <label htmlFor="status" className="block font-medium">Work Order Status</label>
                        <select
                            id='status'
                            name='state'
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                            value={form.state}
                            autoComplete="off"
                        >
                            <option>OPEN</option>
                            <option>ON HOLD</option>
                            <option>IN PROGRESS</option>
                            <option>IN REVIEW</option>
                            <option>COMPLETED</option>
                        </select>
                    </div>
                </div>
            </form>
            <div className='mb-6 p-4 bg-gray-50 rounded shadow-sm'>
            <h3>Tasks</h3>
            {form.tasks.length === 0 ? (
                <p className="italic text-gray-500">No tasks yet</p>
            ) : (form.tasks.map((t,i) =>
                <TaskCard
                key={i}
                task={t}
                workers={workers}
                readOnly={false}
                onSave={updated => savePendingTask(i, updated)}
                onRemove={ () => removePendingTask(i)}
                />
            ))}
            </div>

            <NewTaskSection
                workers={workers}
                onAdd={addNewTask}
            />

            <form className='flex justify-between m-1' onSubmit={handleSubmit}>
                <button onClick={() => navigate(-1)}
                    className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                    ← Back
                </button>
                <button type="submit"
                    className="mb-4 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">
                    Create Work Order
                </button>
            </form>

        </div>
    );
}