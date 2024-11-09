import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  auth: {
    loggedIn: false, // Default value for loggedIn
  },
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'LOGIN': // You can add a case for login if needed
      return { ...state, auth: { ...state.auth, loggedIn: true } }
    case 'LOGOUT': // And for logout
      return { ...state, auth: { ...state.auth, loggedIn: false } }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
