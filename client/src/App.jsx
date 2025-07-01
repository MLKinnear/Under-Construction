import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ClientDetail from './pages/ClientDetail'
import PrivateRoute from './components/PrivateRoute'
import logo from './assets/underconstructionlogo.png'

function App() {
  return (
    <div>
      <div className='flex justify-center'>
        <img src={logo} alt="Under Construction Logo" className='w-24 m-2 rounded-sm' />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/dashboard' replace/>}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>} />
          <Route path="/client/:id" element={
            <PrivateRoute>
              <ClientDetail/>
            </PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
