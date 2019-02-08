import {
  FETCH_ALL_USERS_SUCCESS,
  FETCH_USER_INTRO_SUCCESS,
} from 'actions'

const defaultSession = {
  users: []
}

export default function userReducer(state = defaultSession, action) {
  switch (action.type) {
    case FETCH_ALL_USERS_SUCCESS:
      return { ...state, users: action.payload }
    case FETCH_USER_INTRO_SUCCESS:
      return { ...state, [action.params.username]: JSON.parse(action.payload) }
    default:
      return state
  }
}
