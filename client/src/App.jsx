import React from 'react'
import './api/axiosConfig'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ClientDetail from './pages/ClientDetail'
import ProfilePage from './pages/ProfilePage'
import PrivateRoute from './components/PrivateRoute'
import NavBar from './components/NavBar'
import logo from './assets/underconstructionlogo.png'

function App() {
  return (
    <div>
      <div className='flex justify-center'>
        <img src={logo} alt="Under Construction Logo" className='w-24 m-2 rounded-sm' />
      </div>
      <BrowserRouter>
        <NavBar />
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
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage/>
            </PrivateRoute>} />
          {/* <Route path="/clients" element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>} />
          <Route path="/work-orders" element={
            <PrivateRoute>
              <div>WorkOrdersPage</div>
            </PrivateRoute>} />
          <Route path="/tasks" element={
            <PrivateRoute>
              <div>TasksPage</div>
            </PrivateRoute>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
