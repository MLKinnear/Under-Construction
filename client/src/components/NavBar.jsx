import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { User } from 'lucide-react'

export default function NavBar() {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const handleLogout = () => {
        const ok = window.confirm('Are you sure you want to log out?')
        if (!ok) return
        dispatch(logout())
    }

    return (
        <nav className="p-2 mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                {user && pathname !== '/dashboard' && (
                    <NavLink to="/dashboard"
                    className="px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                        Dashboard
                    </NavLink>
                )}
                {user && (
                    <NavLink to="/clients"
                    className="px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                        Clients
                    </NavLink>
                )}
                {user && (
                    <NavLink to="/work-orders"
                    className="px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                        Work Orders
                    </NavLink>
                )}
                {user?.role === 'worker' && (
                    <NavLink to="/tasks"
                    className="px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                        Tasks
                    </NavLink>
                )}
            </div>

            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <NavLink to="/profile"
                        className="flex items-center px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                            <User className="w-5 h-5 mr-1" />
                            Profile
                        </NavLink>
                        <button onClick={handleLogout}
                        className="px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                            Logout
                        </button>
                    </>
                ) : (
                    <NavLink to="/login"
                    className="px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                        Login
                    </NavLink>
                    )}
            </div>
        </nav>

    )
}