import {
  REQUEST_ALL_USERS,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_USER_INTRO_SUCCESS,
  FETCH_PAGINATED_USERS_SUCCESS,
} from 'actions'

const defaultSession = {
  users: [],
  loading: true,
  paginatedUsers: [
    { list: [] }
  ],
  offset: 0,
}

export default function userReducer(state = defaultSession, action) {
  switch (action.type) {
    case REQUEST_ALL_USERS:
      return { ...state, loading: true }
    case FETCH_ALL_USERS_SUCCESS:
      return { ...state, users: action.payload, loading: false }
    case FETCH_PAGINATED_USERS_SUCCESS:
      if (action.payload.page === 1) {
        return { ...state,
          paginatedUsers: [{ list: action.payload.users }],
          offset: action.payload.users.length
        }
      }
      return { ...state,
        paginatedUsers: [...state.paginatedUsers, { list: action.payload.users }],
        offset: state.offset + action.payload.users.length
      }
    case FETCH_USER_INTRO_SUCCESS:
      return { ...state, [action.params.username]: JSON.parse(action.payload) }
    default:
      return state
  }
}
