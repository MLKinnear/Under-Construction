import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


export default function PrivateRoute({ children, roles }) {
  const { token, role } = useSelector(state => state.auth);


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}