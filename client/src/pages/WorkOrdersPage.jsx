import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Squares2X2Icon, Bars4Icon } from '@heroicons/react/24/outline';
import WorkOrderCard from '../components/WorkOrderCard';

export default function WorkOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stateFilter, setStateFilter] = useState('All');
    const [layout, setLayout] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function loadWorkOrders() {
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/workorders', {
                        headers: { Authorization: `Bearer ${token}`}
                });
                setOrders(data);
            } catch(err) {
                console.log(err);
            } finally{
                setLoading(false);
            }
        }
        loadWorkOrders();
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('workorderLayout');
        if (saved === 'grid' || saved === 'list') {
            setLayout(saved);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('workorderLayout', layout);
    }, [layout]);

    if (loading) return <p>Loading work orders...</p>;

    const states = ['All', ...Array.from(new Set(orders.map(o => o.state)))];

    const filteredOrders = orders.filter(order => {
        const matchesState = stateFilter === 'All' || order.state === stateFilter;
        const term = searchTerm.toLowerCase();
        const matchClient = order.client?.name?.toLowerCase().includes(term);
        const matchNumber = order.number?.toString().toLowerCase().includes(term);
        const matchWorker = order.tasks?.some(task =>
            task.assignedTo?.name?.toLowerCase().includes(term)
        );
        return matchesState && (matchClient || matchNumber || matchWorker);
    });

    return (
        <div>
            <h1 className='mb-6 text-center text-4xl'>Work Orders</h1>

            <div className='container mx-auto p-6'>
                <div className='flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4'>
                    <div className='flex items-center space-x-2'>
                        <p className='text-xl'>Filter:</p>
                        <select
                            id='filter'
                            value={stateFilter}
                            onChange={e => setStateFilter(e.target.value)}
                            className='p-2 border rounded'
                        >
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                    <input
                        id='search'
                        type='text'
                        placeholder='client name or work order #'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className='p-2 border rounded max-w-60 sm:w-1/3'
                    />
                </div>
                {filteredOrders.length === 0 ? (
                    <p className='text-center'>No work orders match your criteria.</p>
                ) : (
                    <div>
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
                            {filteredOrders.map(order => (
                                <WorkOrderCard key={order._id} order={order} layout={layout} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
	);
}