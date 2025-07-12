import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';


export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    const matchName = client.name.toLowerCase().includes(term);
    const matchPhone = client.phone?.toLowerCase().includes(term);
    const address = client.address;
    const addressString =
      typeof address === 'string'
        ? address.toLowerCase()
        : `${address.street} ${address.city} ${address.province} ${address.country} ${address.postalCode}`
            .toLowerCase();
    const matchAddress = addressString.includes(term);
    return matchName || matchPhone || matchAddress;
})

    return (
        <div>
            <h1 className='mb-2 text-center text-4xl'>Clients</h1>
            <div className=' m-2 space-y-2 md:space-y-0'>
                <button
                onClick={() => setShowForm(true)}
                className='px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600'
                >
                Add Client
                </button>
            </div>

            {showForm && (
                <ClientForm
                onSuccess={newClient => {
                    setClients([newClient, ...clients]);
                    setShowForm(false);
                    setSearchTerm('');
                }}
                onCancel={() => setShowForm(false)}
                />
            )}

            <div className='container mx-auto p-6'>
                <h2 className='text-2xl mb-4'>Your Clients</h2>
                <input
                type='text'
                placeholder='Search clients by name, phone, or address...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full md:w-1/4 p-2 border rounded'
                />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredClients.map(client => (
                    <ClientCard key={client._id} client={client} />
                ))}
                {filteredClients.length === 0 && (
                    <p className='text-center col-span-full'>No clients match your search.</p>
                )}
                </div>
            </div>
        </div>
    )
}