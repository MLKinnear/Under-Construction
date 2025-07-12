import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Squares2X2Icon, Bars4Icon } from '@heroicons/react/24/outline';
import WorkOrderCard from '../components/WorkOrderCard';

export default function WorkOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stateFilter, setStateFilter] = useState('All');
    const [layout, setLayout] = useState('');

    useEffect(() => {
        async function loadWorkOrders() {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/workorders', {
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

    const filteredOrders =
        stateFilter === 'All'
            ? orders
            : orders.filter(order => order.state === stateFilter);

    return (
        <div>
            <h1 className='mb-6 text-center text-4xl'>Work Orders</h1>

            <div className='container mx-auto p-6'>
                <div className='flex text-center justify-center max-h-10'>
                    <p className='p-1 text-xl'>Filter</p>
                    <select
                        value={stateFilter}
                        onChange={e => setStateFilter(e.target.value)}
                        className='p-2 border rounded'
                    >
                        {states.map(state => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>
                {filteredOrders.length === 0 ? (
                    <p className='text-center'>No work orders match your filter.</p>
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