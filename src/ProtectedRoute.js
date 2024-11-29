import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ loggedIn }) => {
  return loggedIn ? <Outlet /> : <Navigate to="/login" />
}

ProtectedRoute.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
}

export default ProtectedRoute
