import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'

export default function Dashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        const ok = window.confirm('Are you sure you want to log out?')
        if (!ok) return
        dispatch(logout())
        navigate('/login', { replace: true })
    }

    return (
        <div>
            <div className='flex justify-end mr-2'>
                    <button
                    onClick={handleLogout}
                    className='px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600'>
                        Log out
                    </button>
                {/* <Link to='/register'>
                    <button className='px-6 py-2 rounded bg-green-500 text-white hover:bg-green-600'>
                        Register
                    </button>
                </Link> */}
            </div>
        </div>
    )
}