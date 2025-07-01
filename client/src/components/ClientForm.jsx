import { useState } from "react";
import axios from "axios";

export default function ClientForm({ onSuccess, onCancel }) {
    const [client, setClient] = useState({
        name: '',
        phone: '',
        address: { street: '', city: '', postalCode: '', country: ''}
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parts = name.split('.');
        if (parts.length === 2) {
            const [parent, key] = parts;
            setClient((c) => ({ ...c, [parent]: { ...c[parent],[key]: value}}));
        } else { setClient((c) => ({ ...c,[name]:value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try{
            const token = localStorage.getItem('token');
            const { data } = await axios.post ('/api/clients', client,
                {headers: { Authorization: `Bearer ${token}`}}
            );
            onSuccess(data);
        } catch (err) {
            console.error('Create client failed:', err.response?.data || err);
            const msg = err.response?.data?.error || JSON.stringify(err.response?.data) || 'Failed to save client!';
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h2 className='flex justify-center text-xl'>New Client</h2>
            <div className='flex justify-center'>
            <form onSubmit={handleSubmit} className='flex flex-col m-8 p-5 gap-4 shadow-lg rounded-lg bg-white min-w-[300px]'>
                <label className="flex justify-between">
                    <span className="text-lg m-1">Name:</span>
                    <input
                        name="name"
                        type='text'
                        placeholder='Name'
                        value={client.name}
                        onChange={handleChange}
                        required
                        className='bg-blue-50 rounded-sm shadow-md p-1'
                    />
                </label>

                <label className="flex justify-between">
                    <span className="text-lg m-1">Phone:</span>
                    <input
                        name="phone"
                        type='tel'
                        placeholder='Phone'
                        value={client.phone}
                        onChange={handleChange}
                        required
                        className='bg-blue-50 rounded-sm shadow-md p-1'
                    />
                </label>

                <label className="flex justify-between">
                    <span className="text-lg m-1">Street:</span>
                    <input
                        name="address.street"
                        type='text'
                        placeholder='Street'
                        value={client.address.street}
                        onChange={handleChange}
                        required
                        className='bg-blue-50 rounded-sm shadow-md p-1'
                    />
                </label>
                
                <label className="flex justify-between">
                    <span className="text-lg m-1">City:</span>
                    <input
                        name="address.city"
                        type='text'
                        placeholder='City'
                        value={client.address.city}
                        onChange={handleChange}
                        required
                        className='bg-blue-50 rounded-sm shadow-md p-1'
                    />
                </label>

                <label className="flex justify-between">
                    <span className="text-lg m-1">Postal Code:</span>
                    <input
                        name="address.postalCode"
                        type='text'
                        placeholder='Postal Code'
                        value={client.address.postalCode}
                        onChange={handleChange}
                        required
                        className='bg-blue-50 rounded-sm shadow-md p-1'
                    />
                </label>

                <label className="flex justify-between">
                    <span className="text-lg m-1">Country:</span>
                    <input
                        name="address.country"
                        type='text'
                        placeholder='Country'
                        value={client.address.country}
                        onChange={handleChange}
                        required
                        className='bg-blue-50 rounded-sm shadow-md p-1'
                    />
                </label>

                <div className='flex justify-center'>
                    <button
                        type='submit'
                        disabled={saving}
                        className='flex justify-center content-between px-6 py-2 max-w-24 rounded bg-blue-500 text-white hover:bg-blue-600'
                    >
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>

                <div className='flex justify-center'>
                    <button
                        type='button'
                        onClick={onCancel}
                        disabled={saving}
                        className='flex justify-center content-between px-6 py-2 max-w-24 rounded bg-blue-500 text-white hover:bg-blue-600'
                    >
                        Cancel
                    </button>
                </div>

            </form>
            </div>
        </div>
    )
}