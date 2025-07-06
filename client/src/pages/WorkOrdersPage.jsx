import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkOrderCard from '../components/WorkOrderCard';

export default function WorkOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
    <div>
      <h1 className='mb-2 text-center text-4xl'>Work Orders</h1>

      <div className="container mx-auto p-6">
        {orders.length === 0 ? <p>No work orders found.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map(order => (
                <WorkOrderCard key={order._id} order={order} />
              ))}
            </div>
        )}
      </div>
    </div>
  );
}