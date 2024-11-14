import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false)

  const login = (callback) => {
    setLoggedIn(true)
    if (callback) callback()
  }

  const logout = (callback) => {
    setLoggedIn(false)
    if (callback) callback()
  }

  return <AuthContext.Provider value={{ loggedIn, login, logout }}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => useContext(AuthContext)
