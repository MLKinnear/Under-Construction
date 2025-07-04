import { Link } from 'react-router-dom';

export default function ClientCard({ client }) {
    return (
        <Link to={`/client/${client._id}`}>
            <div className='flex flex-col m-8 p-5 gap-4 shadow-lg rounded-lg bg-white min-w-[300px]'>
                <h3 className='text-lg font-semibold'>{client.name}</h3>
                <p className='text-sm font-semibold'>Phone: {client.phone}</p>
                <p className='text-sm font-semibold'>Email: {client.email}</p>
                <p className='text-sm font-semibold'>Address: {`${client.address.street}, ${client.address.city}`}</p>
            </div>
        </Link>
    );
}