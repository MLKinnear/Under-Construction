import React from 'react';

export default function WorkOrderDetailCard({
  details,
  isEditing,
  setIsEditing,
  saveDetails,
  order,
  setDetails,
  userRole
}) {
    if (!details) return null;

    const toInputDateTime = iso => {
        if (!iso) return '';
        const dt = new Date(iso);
        const pad = n => String(n).padStart(2, '0');
        const year = dt.getFullYear();
        const month = pad(dt.getMonth() + 1);
        const day = pad(dt.getDate());
        const hours = pad(dt.getHours());
        const minutes = pad(dt.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <div className="border p-4 rounded shadow-sm bg-white mb-6">
            <h2 className="text-2xl font-semibold mb-2 flex justify-between items-center">
                Work Order Details
                {userRole !== 'worker' && (!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Edit
                </button>
                ) : (
                <div className="flex gap-2">
                    <button
                    onClick={saveDetails}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                    Save
                    </button>
                    <button
                    onClick={() => {setIsEditing(false)}}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                    Cancel
                    </button>
                </div>
                ))}
            </h2>

            {isEditing ? (userRole !== 'worker' && (
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">State</label>
                        <select
                        id='filter'
                        className="w-full border p-2 rounded"
                        value={details.state}
                        onChange={e => setDetails(d => ({ ...d, state: e.target.value }))}
                        >
                        {['OPEN','ON HOLD','IN PROGRESS','IN REVIEW','COMPLETED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">Alt Contact Name</label>
                        <input
                        id='name'
                        type="text"
                        className="w-full border p-2 rounded"
                        value={details.altContact.name || ''}
                        onChange={e => setDetails(d => ({...d,
                            altContact: { ...d.altContact, name: e.target.value }
                        }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Alt Contact Phone</label>
                        <input
                        id='phone'
                        type="text"
                        className="w-full border p-2 rounded"
                        value={details.altContact.phone || ''}
                        onChange={e => setDetails(d => ({...d,
                            altContact: { ...d.altContact, phone: e.target.value }
                        }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Alt Contact Address</label>
                        <input
                        id='address'
                        type="text"
                        className="w-full border p-2 rounded"
                        value={details.altContact.address || ''}
                        onChange={e => setDetails(d => ({...d,
                            altContact: { ...d.altContact, address: e.target.value }
                        }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Start Date</label>
                        <input
                        id='start'
                        type="datetime-local"
                        className="w-full border p-2 rounded"
                        value={toInputDateTime(details.promised.start)}
                        onChange={e => setDetails(d => ({...d,
                            promised: { ...d.promised, start: new Date(e.target.value).toISOString() }
                        }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Promised By</label>
                        <input
                        id='end'
                        type="datetime-local"
                        className="w-full border p-2 rounded"
                        value={toInputDateTime(details.promised.by)}
                        onChange={e => setDetails(d => ({...d,
                            promised: { ...d.promised, by: new Date(e.target.value).toISOString() }
                        }))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Notes</label>
                        <textarea
                        id='note'
                        className="w-full border p-2 rounded"
                        value={details.notes}
                         onChange={e => setDetails(d => ({ ...d, notes: e.target.value }))}
                        />
                    </div>
                </div>
            )) : (
                <>
                    <p><strong>State:</strong> {order.state}</p>
                    {order.altContact?.name && (
                        <>
                        <p><strong>Alt Contact:</strong> {order.altContact.name}</p>
                        <p><strong>Phone:</strong> {order.altContact.phone}</p>
                        <p><strong>Address:</strong> {order.altContact.address}</p>
                        </>
                    )}
                    <p><strong>Start:</strong>{' '}
                        {order.promised.start ? new Date(order.promised.start).toLocaleString() : '—'}</p>
                    <p><strong>Promised By:</strong>{' '}
                        {order.promised.by ? new Date(order.promised.by).toLocaleString() : '—'}</p>
                    {order.notes && (<p><strong>Notes:</strong> {order.notes}</p>)}
                </>
            )}
        </div>
    );
}