// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Navigate } from 'react-router-dom'

// export default function PrivateRoute({ children }) {
//     const token = useSelector(state => state.auth.token)
//     return token ? children : <Navigate to="/login" replace />
// }

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// roles is an optional array of allowed roles, e.g. ['manager']
export default function PrivateRoute({ children, roles }) {
  const { token, role } = useSelector(state => state.auth);

  // 1) Not logged in?
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) Logged in, but roles-limited and current role isn't in allowed list?
  if (roles && !roles.includes(role)) {
    // send them somewhere safe—dashboard is a good fallback
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise OK
  return children;
}