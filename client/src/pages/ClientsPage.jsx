import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Squares2X2Icon, Bars4Icon } from '@heroicons/react/24/outline';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';


export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [layout, setLayout] = useState('');

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

    useEffect(() => {
        const saved = localStorage.getItem('clientsLayout');
        if (saved === 'grid' || saved === 'list') {
            setLayout(saved);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('clientsLayout', layout);
    }, [layout]);

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
                <div className='flex justify-center max-h-10'>
                    <p className='text-xl p-1'>Search</p>
                    <input
                    type='text'
                    placeholder='Name, number, or Address...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='w-full md:w-1/4 p-2 border rounded'
                    />
                </div>

                <div className="hidden sm:flex justify-center space-x-2 m-4">
                    <button
                        onClick={() => setLayout('grid')}
                        aria-label="Grid view"
                        className={`p-2 rounded 
                        ${layout === 'grid'
                            ? 'bg-blue-500 text-white shadow-inner'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <Squares2X2Icon className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setLayout('list')}
                        aria-label="List view"
                        className={`p-2 rounded 
                        ${layout === 'list'
                            ? 'bg-blue-500 text-white shadow-inner'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <Bars4Icon className="w-5 h-5" />
                    </button>
                </div>
                <div className={
                    layout === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col space-y-4'
                }>
                {filteredClients.map(client => (
                    <ClientCard key={client._id} client={client} layout={layout} />
                ))}
                {filteredClients.length === 0 && (
                    <p className='text-center col-span-full'>No clients match your search.</p>
                )}
                </div>
            </div>
        </div>
    )
}