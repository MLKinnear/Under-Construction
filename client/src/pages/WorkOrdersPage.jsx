import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkOrderCard from '../components/WorkOrderCard';

export default function WorkOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stateFilter, setStateFilter] = useState('All');

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

    if (loading) return <p>Loading work orders...</p>;

    const states = ['All', ...Array.from(new Set(orders.map(o => o.state)))];

    const filteredOrders =
        stateFilter === 'All'
            ? orders
            : orders.filter(order => order.state === stateFilter);

    return (
        <div>
            <h1 className='mb-2 text-center text-4xl'>Work Orders</h1>
            
            <div className='flex text-center justify-end m-2'>
                <p className='p-2 text-xl'>Filter</p>
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

            <div className='container mx-auto p-6'>
                {filteredOrders.length === 0 ? (
                    <p className='text-center'>No work orders match your filter.</p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredOrders.map(order => (
                            <WorkOrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
	);
}