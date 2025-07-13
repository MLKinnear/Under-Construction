import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfilePage() {
    const [user, setUser]       = useState(null);
    const [form, setForm]       = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving]   = useState(false);
    const [editing, setEditing] = useState(false);
    const [rotating, setRotating] = useState(false);

    useEffect(() => {
        async function load() {
            try{
                const { data } = await axios.get('/api/users/profile');
                setUser(data);
                setForm({ name: data.name, email: data.email });
            } catch (err) {
                console.error(err);
                alert('Could not load profile');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSave = async e => {
        e.preventDefault();
        if (form.password && form.password !== form.confirmPassword) {
            return alert('Passwords do not match');
        }
        setSaving(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
                ...(form.password ? { password: form.password } : {})
            };
            await axios.put('/api/users/profile', payload);
            alert('Profile updated');
            setUser(u => ({ ...u, name: form.name, email: form.email }));
            setEditing(false);
            setForm(f => ({ ...f, password: '', confirmPassword: ''}));
        } catch (err) {
            console.error('Update profile error:', err.response?.data || err);
            const serverMsg = err.response?.data?.error;
            alert(serverMsg || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleRotate = async () => {
        if (!window.confirm('Generate a new manager key?')) return;
        setRotating(true);
        try {
            const { data } = await axios.put('/api/users/profile/rotate-key');
            setUser(u => ({ ...u, accessKey: data.accessKey}));
            alert('New key generated');
        } catch (err) {
            console.error(err);
            alert('Could not generate new key');
        } finally {
            setRotating(false);
        }
    };

    if (loading) return <p className='p-6'>Loading...</p>

    return (
        <div>
            <h1 className='mb-2 text-center text-4xl'>Profile</h1>
            <div className="flex justify-center p-6">
                {editing ? (
                <form onSubmit={handleSave} className="m-8 p-5 shadow-lg rounded-lg space-y-4 max-w-md bg-white">
                    <h2 className="text-2xl">Edit Profile</h2>

                    <label className="block">
                    <span>Name</span>
                    <input
                        id='name'
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded mt-1"
                        autoComplete='off'
                    />
                    </label>

                    <label className="block">
                    <span>Email</span>
                    <input
                        id='email'
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded mt-1"
                        autoComplete='off'
                    />
                    </label>

                    <label className="block">
                    <span>New Password</span>
                    <input
                        id='password'
                        name="password"
                        type="password"
                        value={form.password || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1"
                        autoComplete='off'
                    />
                    </label>

                    <label className="block">
                    <span>Confirm Password</span>
                    <input
                        id='confirmPassword'
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1"
                        autoComplete='off'
                    />
                    </label>

                    <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => {
                        setForm({ name: user.name, email: user.email });
                        setEditing(false);
                        }}
                        disabled={saving}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                    </div>
                </form>
                ) : (
                <div className="space-y-4">
                    <h2 className="text-2xl">{user.name.toUpperCase()}</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role.toUpperCase()}</p>

                    {user.role === 'manager' && (
                    <div>
                        <p><strong>Manager Key:</strong> <code>{user.accessKey}</code></p>
                        <button
                        onClick={handleRotate}
                        disabled={rotating}
                        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                        {rotating ? 'Rotating…' : 'Rotate Key'}
                        </button>
                    </div>
                    )}

                    {user.role === 'worker' && user.managerName && (
                    <p><strong>Manager:</strong> {user.managerName}</p>
                    )}

                    <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                    Edit Profile
                    </button>
                </div>
                )}
            </div>
        </div>
        );

}