import React from 'react'
import './api/axiosConfig'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ClientsPage from './pages/ClientsPage'
import ClientDetail from './pages/ClientDetail'
import WorkOrdersPage from './pages/WorkOrdersPage'
import WorkOrderDetailPage from './pages/WorkOrderDetailPage'
import CreateWorkOrder from './pages/CreateWorkOrder'
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
          <Route path="/clients/:id" element={
            <PrivateRoute roles={['manager']}>
              <ClientDetail/>
            </PrivateRoute>} />
          <Route path="/clients/:id/create" element={
            <PrivateRoute roles={['manager']}>
              <CreateWorkOrder/>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage/>
            </PrivateRoute>} />
           <Route path="/clients" element={
            <PrivateRoute roles={['manager']}>
              <ClientsPage/>
            </PrivateRoute>} />
          <Route path="/workorders" element={
            <PrivateRoute>
              <WorkOrdersPage/>
            </PrivateRoute>} />
            <Route path="/workorders/:id" element={
            <PrivateRoute>
              <WorkOrderDetailPage/>
            </PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
