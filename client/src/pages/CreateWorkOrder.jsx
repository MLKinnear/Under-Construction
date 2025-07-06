import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function CreateWorkOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [client, setClient] = useState(null);

    const [form, setForm] = useState({
        client: id,
        altContact: { name: '', phone: '', address: '' },
        promised: { start: '', by: '' },
        notes: '',
        state: 'OPEN'
    });

    const [nextNumber, setNextNumber] = useState(null);

    useEffect(() => {
        axios.get(`/api/clients/${id}`, {headers: { Authorization: `Bearer ${token}`}})
        .then(res => setClient(res.data))
        .catch(err => console.error('Failed to load client', err));
    }, [id, token]);

    useEffect(() => {
        axios.get('/api/workorders/next-number', { headers: { Authorization: `Bearer ${token}` }})
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
        await axios.post('/api/workorders', {...form, number: nextNumber},
            {headers : { Authorization: `Bearer ${token}`}}
        );
        navigate(`/clients/${id}`);
    };

    return (
        <div>
            {client && (
                <div className='mb-6 p-4 bg-gray-50 rounded'>
                    <h4 className='text-lg font-semibold'>Client Info</h4>
                    {/* Work Order Number */}
                    {nextNumber !== null &&(
                    <div>
                        <label><strong>Work Order #</strong></label>
                        <input value={nextNumber} disabled/>
                    </div>
                    )}
                    <p><strong>Name:</strong> {client.name}</p>
                    <p><strong>Phone:</strong> {client.phone}</p>
                    <p><strong>Address:</strong>{' '}
                        {client.address.street}, {client.address.city}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>

                {/* Alternative Contact Info */}
                <div>
                    <p>Additional Contact Information:</p>
                    <label>Name</label>
                    <input name='altContact.name' onChange={handleChange} value={form.altContact.name} />
                    <label>Phone</label>
                    <input name='altContact.phone' onChange={handleChange} value={form.altContact.phone} />
                    <label>Address</label>
                    <input name='altContact.address' onChange={handleChange} value={form.altContact.address} />
                </div>

                {/* Promised dates */}
                <div>
                    <label>Start Date</label>
                    <input
                        type='datetime-local'
                        name='promised.start'
                        onChange={handleChange}
                        value={form.promised.start}
                    />
                    <label>Promised Date</label>
                    <input
                        type='datetime-local'
                        name='promised.by'
                        onChange={handleChange}
                        value={form.promised.by}
                    />
                </div>

                {/* Notes & State */}
                <div>
                    <label>Notes</label>
                    <textarea name='notes' onChange={handleChange} value={form.notes} />
                    <label>Work Order Status</label>
                    <select name='state' onChange={handleChange} value={form.state}>
                        <option>OPEN</option>
                        <option>ON HOLD</option>
                        <option>IN PROGRESS</option>
                        <option>IN REVIEW</option>
                        <option>COMPLETED</option>
                    </select>
                </div>
                
                <button type='submit'
                className='px-6 py-1 rounded bg-green-500 text-white hover:bg-green-600'>
                Create
                </button>
            </form>
        </div>
    );
}