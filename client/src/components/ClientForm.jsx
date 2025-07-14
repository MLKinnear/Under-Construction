import { useState } from "react";
import api from '../api/axiosConfig';

export default function ClientForm({ onSuccess, onCancel }) {
    const [client, setClient] = useState({
        name: '',
        phone: '',
        email: '',
        address: {
            street: '',
            city: '',
            postalCode: '',
            province: '',
            country: ''}
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
            const { data } = await api.post ('/clients', client,
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
                        <label htmlFor="name" className="block">
                            <span>Name</span>
                            <input
                                id='name'
                                name="name"
                                type='text'
                                value={client.name}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="phone" className="block">
                            <span>Phone</span>
                            <input
                                id='phone'
                                name="phone"
                                type='tel'
                                value={client.phone}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="email" className="block">
                            <span>Email</span>
                            <input
                                id='email'
                                name="email"
                                type='text'
                                value={client.email}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="street" className="block">
                            <span>Street</span>
                            <input
                                id='street'
                                name="address.street"
                                type='text'
                                value={client.address.street}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="city" className="block">
                            <span >City</span>
                            <input
                                id='city'
                                name="address.city"
                                type='text'
                                value={client.address.city}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="postalCode" className="block">
                            <span>Postal Code</span>
                            <input
                                id='postalCode'
                                name="address.postalCode"
                                type='text'
                                value={client.address.postalCode}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="province" className="block">
                            <span>Province</span>
                            <input
                                id='province'
                                name="address.province"
                                type='text'
                                value={client.address.province}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className='w-full p-2 border rounded mt-1'
                            />
                        </label>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="country" className="block">
                            <span>Country</span>
                            <input
                                id='country'
                                name="address.country"
                                type='text'
                                value={client.address.country}
                                onChange={handleChange}
                                required
                                autoComplete="off"
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