const defaultSession = {
  users: []
}

export default function userReducer(state = defaultSession, action) {
  switch (action.type) {
    case 'FETCH_ALL_USERS_SUCCESS':
      return { ...state, users: action.payload }
    default:
      return state
  }
}
