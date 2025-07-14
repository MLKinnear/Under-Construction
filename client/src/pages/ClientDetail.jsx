import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import WorkOrderCard from '../components/WorkOrderCard';

export default function ClientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        async function loadClient() {
            try{
                const token = localStorage.getItem('token');
                const { data } = await api.get(`/api/clients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClient(data);
                setFormData({
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    address: { ...data.address }
                });
            } catch (err) {
                console.error(err);
                alert('Could not load client');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        }
        loadClient();
    }, [id, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        api.get(`/api/workorders/clients/${id}`, { headers: { Authorization: `Bearer ${token}`} })
            .then(res => {
            const withClient = res.data.map(o => ({ ...o, client }));
            setOrders(withClient);
        })
        .catch(err => console.error('Could not load work order', err))
        .finally(() => setOrdersLoading(false));
    }, [id, client]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parts = name.split('.');
        if (parts.length === 2) {
            const [parent, key] = parts;
            setFormData( fd => ({...fd,[parent]:{...fd[parent], [key]: value}}));
        } else {
            setFormData(fd => ({...fd, [name]: value}));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const { data: updated } = await api.put(`/api/clients/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}`}
            });
            setClient(updated);
            setFormData({
                name: updated.name,
                phone: updated.phone,
                email: updated.email,
                address: {...updated.address}
            });
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className='p-6'>Loading client...</p>

    return (
        <div>
            <h1 className='mb-2 text-center text-4xl'>Client Details</h1>
            <div className="flex justify-center p-6">
                {editing ? (
                    <form onSubmit={handleSave} className="m-8 p-5 shadow-lg rounded-lg space-y-4 max-w-md bg-white">
                    <h2 className="text-2xl">Edit Client</h2>

                    <label className="block">
                        <span>Name</span>
                        <input
                            id='name'
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>

                    <label className="block">
                        <span>Phone</span>
                        <input
                            id='phone'
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>

                    <label className="block">
                        <span>Email</span>
                        <input
                            id='email'
                            name="email"
                            type="text"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>

                    <label className="block">
                        <span>Street</span>
                        <input
                            id='street'
                            name="address.street"
                            type="text"
                            value={formData.address.street || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>

                    <label className="block">
                        <span>City</span>
                        <input
                            id='city'
                            name="address.city"
                            type="text"
                            value={formData.address.city || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>

                    <label className="block">
                        <span>Postal Code</span>
                        <input
                            id='postalCode'
                            name="address.postalCode"
                            type="text"
                            value={formData.address.postalCode || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>

                    <label className="block">
                        <span>Province</span>
                        <input
                            id='province'
                            name="address.province"
                            type="text"
                            value={formData.address.province || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>

                    <label className="block">
                        <span>Country</span>
                        <input
                            id='country'
                            name="address.country"
                            type="text"
                            value={formData.address.country || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>

                    <div className="flex space-x-2">
                        <button type="button"
                            onClick={() => {
                                setFormData({
                                name: client.name,
                                phone: client.phone,
                                email: client.email,
                                address: { ...client.address }
                                });
                                setEditing(false);
                            }} disabled={saving}
                            className="px-4 py-2 border rounded">
                            Cancel
                        </button>

                        <button type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            {saving ? 'Saving…' : 'Save'}
                        </button>

                    </div>
                    </form>
                ) : (
                    <div>
                        <div className='flex justify-center'>
                            <div className="border p-4 rounded shadow-sm bg-white mb-6">
                                <h2 className="text-2xl p-1">{client.name}</h2>
                                    <p className='p-1'><strong>Phone:</strong> {client.phone}</p>
                                    <p className='p-1'><strong>Email:</strong> {client.email}</p>
                                    {client.address && (
                                    <p className='p-1'><strong>Address:</strong>
                                    {client.address.street},
                                    {client.address.city},
                                    </p>
                                    )}
                                    {client.address && (
                                    <p  className='p-1'>
                                    {client.address.province},
                                    {client.address.postalCode},
                                    {client.address.country},
                                    </p>
                                    )}
                            <div className="flex space-x-2 pt-4">
                                <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                Edit
                                </button>
                            </div>
                            </div>
                        </div>
                    <div>
                    <h2 className='flex justify-center text-2xl m-2'>{client.name}’s Work Orders</h2>
                    <Link to={`create`} className=' px-6 py-1 rounded bg-green-500 text-white hover:bg-green-600'>
                    Create Work Order
                    </Link>
                    { ordersLoading ? <p>Loading work orders…</p> : orders.length === 0 ? <p>No work orders yet.</p>
                        :<div className={
                            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        }>
                            {orders.map(order => (
                            <WorkOrderCard key={order._id} order={order} />
                            ))}
                        </div>}
                    </div>
                    </div>
                )}
            </div>
        </div>
  );
}