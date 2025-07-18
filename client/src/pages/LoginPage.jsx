import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, error } = useSelector(state => state.auth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            await dispatch(loginUser({ email, password})).unwrap()
            navigate('/dashboard')
        } catch (errMsg) {
            alert(errMsg)
        }
    }

    return (
        <div>
            <h2 className='flex justify-center text-xl'>Login</h2>
            <div className='flex justify-center'>
            <form onSubmit={handleSubmit} className='flex flex-col m-8 p-5 gap-4 shadow-lg rounded-lg bg-white min-w-[300px]'>

                <p className='text-lg'>Email:</p>
                <input
                    id='email'
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className='bg-blue-50 rounded-sm p-1'
                    autoComplete='off'
                />

                <p className='text-lg'>Password:</p>
                <input 
                    id='password'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='bg-blue-50 rounded-sm p-1'
                    autoComplete='off'
                />

                {error && <p>{error}</p>}
                <div className='flex justify-center'>
                    <button type='submit' disabled={isLoading} className='flex justify-center content-between px-6 py-2 max-w-24 rounded bg-blue-500 text-white hover:bg-blue-600'>
                        {isLoading ? 'Loggin in ...' : 'Login'}
                    </button>
                </div>
                <Link to='/register'>
                    <div className='flex justify-center m-2'>
                        <p>Register?</p>
                    </div>
                </Link>
            </form>
            </div>
        </div>
    )
}