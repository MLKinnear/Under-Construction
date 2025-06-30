import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import axios from 'axios';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';


export default function Dashboard() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        const ok = window.confirm('Are you sure you want to log out?')
        if (!ok) return
        dispatch(logout())
        navigate('/login', { replace: true })
    }

    useEffect(() => {
        async function loadClients(){
        try{
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/clients', {
                headers: { Authorization: `Bearer ${token}`}
            });
            setClients(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    loadClients();
}, []);

if (loading) return <p>Loading clients...</p>

    return (
        <div>
            <div className='flex justify-between m-2'>
                    <button onClick={() => setShowForm(true)}
                    className='px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600'>
                        Add Client
                    </button>
                    <button
                    onClick={handleLogout}
                    className='px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600'>
                        Log out
                    </button>
            </div>

            {showForm && (
                <ClientForm
                    onSuccess={(newClient) => {
                        setClients([newClient, ...clients]);
                        setShowForm(false);
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div className="container mx-auto p-6">
                <h2 className="text-2xl mb-4">Your Clients</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map(client => (
                        <ClientCard key={client._id} client={client} />
                    ))}
                </div>
            </div>
        </div>
    )
}