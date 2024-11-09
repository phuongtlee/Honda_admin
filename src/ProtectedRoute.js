import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types' // Import PropTypes

const ProtectedRoute = ({ loggedIn }) => {
  return loggedIn ? <Outlet /> : <Navigate to="/login" />
}

// Define prop types
ProtectedRoute.propTypes = {
  loggedIn: PropTypes.bool.isRequired, // Validate loggedIn as a boolean and mark it as required
}

export default ProtectedRoute
