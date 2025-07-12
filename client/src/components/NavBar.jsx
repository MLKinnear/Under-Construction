import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { Home, Users, ClipboardList, User, LogOut } from 'lucide-react'

export default function NavBar() {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const handleLogout = () => {
        const ok = window.confirm('Are you sure you want to log out?')
        if (!ok) return
        dispatch(logout())
    }

     const linkClass = 'flex items-center px-4 py-2 rounded ' +
    'bg-blue-500 text-white hover:bg-blue-600'

    return (
        <nav className="p-2 mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                {user && pathname !== '/dashboard' && (
                    <NavLink to="/dashboard" className={linkClass}>
                        <Home className="w-5 h-5 block sm:hidden" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </NavLink>
                )}
                {user?.role === 'manager' && pathname !== '/clients' && (
                    <NavLink to="/clients" className={linkClass}>
                        <Users className="w-5 h-5 block sm:hidden" />
                        <span className="hidden sm:inline">Clients</span>
                    </NavLink>
                )}
                {user && pathname !== '/workorders' && (
                    <NavLink to="/workorders" className={linkClass}>
                        <ClipboardList className="w-5 h-5 block sm:hidden" />
                        <span className="hidden sm:inline">Work Orders</span>
                    </NavLink>
                )}
            </div>

            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        {user && pathname !== '/profile' && (
                            <NavLink to="/profile" className={linkClass}>
                                <User className="w-5 h-5 block sm:hidden" />
                                <span className="hidden sm:inline">Profile</span>
                            </NavLink>
                        )}
                        <button onClick={handleLogout} className={linkClass}>
                            <LogOut className="w-5 h-5 block sm:hidden" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                    {pathname !== '/login' && (
                    <NavLink to="/login" className={linkClass}>
                        <User className="w-5 h-5 block sm:hidden" />
                        <span className="hidden sm:inline">Login</span>
                    </NavLink>
                    )}

                    {pathname !== '/register' && (
                    <NavLink to="/register" className={linkClass}>
                        <User className="w-5 h-5 block sm:hidden" />
                        <span className="hidden sm:inline">Register</span>
                    </NavLink>
                    )}
                    </>
                    )}
                    
            </div>
        </nav>

    )
}