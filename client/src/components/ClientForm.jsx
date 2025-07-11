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
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className='m-8 p-5 shadow-lg rounded-lg space-y-4 bg-white'>
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-3 sm:col-span-1">
                        <label className="block">
                            <span>Name</span>
                            <input
                                name="name"
                                type='text'
                                value={client.name}
                                onChange={handleChange}
                                required
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label className="block">
                            <span>Phone</span>
                            <input
                                name="phone"
                                type='tel'
                                value={client.phone}
                                onChange={handleChange}
                                required
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label className="block">
                            <span>Email</span>
                            <input
                                name="email"
                                type='text'
                                value={client.email}
                                onChange={handleChange}
                                required
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label className="block">
                            <span>Street</span>
                            <input
                                name="address.street"
                                type='text'
                                value={client.address.street}
                                onChange={handleChange}
                                required
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label className="block">
                            <span >City</span>
                            <input
                                name="address.city"
                                type='text'
                                value={client.address.city}
                                onChange={handleChange}
                                required
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label className="block">
                            <span>Postal Code</span>
                            <input
                                name="address.postalCode"
                                type='text'
                                value={client.address.postalCode}
                                onChange={handleChange}
                                required
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label className="block">
                            <span>Province</span>
                            <input
                                name="address.province"
                                type='text'
                                value={client.address.province}
                                onChange={handleChange}
                                required
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label className="block">
                            <span>Country</span>
                            <input
                                name="address.country"
                                type='text'
                                value={client.address.country}
                                onChange={handleChange}
                                required
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                </div>
                <div className='flex space-x-2'>
                    <button
                        type='button'
                        onClick={onCancel}
                        disabled={saving}
                        className='px-4 py-2 border rounded'>
                        Cancel
                    </button>

                    <button
                        type='submit'
                        disabled={saving}
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                        {saving ? 'Saving…' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    )
}