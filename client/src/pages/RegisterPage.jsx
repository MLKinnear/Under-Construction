import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, error } = useSelector(state => state.auth)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [role, setRole] = useState('worker')
    const [managerKey, setManagerKey] = useState('')
    const [productKey, setProductKey] = useState('')
    const [validationError, setValidationError] = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        if (password !== confirm) {
            setValidationError('Password does not match')
            return
        }
        if (role === 'worker' && !managerKey){
            setValidationError('Workers must supply a manager key')
            return
        }
        if (role === 'manager' && !productKey){
            setValidationError('Managers must supply a product key')
            return
        }
        try{
            await dispatch(registerUser({ name, email, password, role, managerKey, productKey})).unwrap()
            navigate('/login')
        } catch{
            // slice.error will display
        }
    }

    return (
        <div>
            <h2 className='flex justify-center text-xl'>Register</h2>
            <div className='flex justify-center'>
            <form onSubmit={handleSubmit} className='flex flex-col m-8 p-5 gap-4 shadow-lg rounded-lg bg-white min-w-[300px]'>
                <div className=' flex justify-center'>
                    <select id='role' className='max-w-24' value={role} onChange={e => setRole(e.target.value)}>
                        <option value={"manager"}>Manager</option>
                        <option value={"worker"}>Worker</option>
                    </select>
                </div>
                <p className='text-lg'>Name:</p>
                <input
                    id='name'
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className='bg-blue-50 rounded-sm p-1'
                    autoComplete='off'
                />

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
                />
                
                <p className='text-lg'>Confirm Password:</p>
                <input
                    id='confirmPassword'
                    type='password'
                    placeholder='Confirm Password'
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    className='bg-blue-50 rounded-sm p-1'
                />
                
                
                {role === 'worker' && (
                    <div>
                        <p className='text-lg mb-4'>Manager Key:</p>
                        <input
                            id='managerkey'
                            type='text'
                            placeholder='Manager Key'
                            value={managerKey}
                            onChange={e => setManagerKey(e.target.value)}
                            required
                            className='bg-blue-50 rounded-sm p-1'
                        />
                    </div>
                )}

                {role === 'manager' && (
                    <div>
                        <p className='text-lg mb-4'>Product Key:</p>
                        <input
                            id='productkey'
                            type='text'
                            placeholder='Product Key'
                            value={productKey}
                            onChange={e => setProductKey(e.target.value)}
                            required
                            className='bg-blue-50 rounded-sm p-1'
                        />
                    </div>
                )}

                {validationError && <p className='error'>{validationError}</p>}
                {error && <p className='flex justify-center error bg-red-100 rounded-sm'>{error}</p>}
                <div className='flex justify-center'>
                    <button type='submit' disabled={isLoading} className='flex justify-center content-between px-6 py-2 max-w-24 rounded bg-blue-500 text-white hover:bg-blue-600'>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </div>
                <Link to='/'>
                    <div className='flex justify-center m-2'>
                        <p>Login?</p>
                    </div>
                </Link>

            </form>
            </div>
        </div>
    )
}