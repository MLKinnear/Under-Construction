// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ClientCard from '../components/ClientCard';
// import ClientForm from '../components/ClientForm';


export default function Dashboard() {
//     const [clients, setClients] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         async function loadClients(){
//         try{
//             const token = localStorage.getItem('token');
//             const { data } = await axios.get('/api/clients', {
//                 headers: { Authorization: `Bearer ${token}`}
//             });
//             setClients(data);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }
//     loadClients();
// }, []);

// if (loading) return <p>Loading clients...</p>

    return (
        // <div>
        //     <h1 className='mb-2 text-center text-4xl'>Dashboard</h1>
        //     <div className='flex justify-between m-2'>
        //             <button onClick={() => setShowForm(true)}
        //             className='px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600'>
        //                 Add Client
        //             </button>
        //     </div>

        //     {showForm && (
        //         <ClientForm
        //             onSuccess={(newClient) => {
        //                 setClients([newClient, ...clients]);
        //                 setShowForm(false);
        //             }}
        //             onCancel={() => setShowForm(false)}
        //         />
        //     )}

        //     <div className="container mx-auto p-6">
        //         <h2 className="text-2xl mb-4">Your Clients</h2>
        //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //             {clients.map(client => (
        //                 <ClientCard key={client._id} client={client} />
        //             ))}
        //         </div>
        //     </div>
        // </div>
        <div >
            <h1 className='mb-2 text-center text-4xl'>Dashboard</h1>
            <p className="m-6 flex justify-center text-2xl">Create TODO List Function here</p>
        </div>
    )
}