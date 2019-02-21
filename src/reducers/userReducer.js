import {
  REQUEST_ALL_USERS,
  REQUEST_PAGINATED_USERS,
  REVERT_PAGINATED_USERS_FULL,
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
  paginatedObj: {
    offset: 0,
    loading: true,
    full: false,
  }
}

export default function userReducer(state = defaultSession, action) {
  switch (action.type) {
    case REQUEST_ALL_USERS:
      return { ...state, loading: true }
    case FETCH_ALL_USERS_SUCCESS:
      return { ...state, users: action.payload, loading: false }
    case REQUEST_PAGINATED_USERS:
      return { ...state,
        paginatedObj: { ...state.paginatedObj, loading: true }
      }
    case REVERT_PAGINATED_USERS_FULL:
      return { ...state,
        paginatedObj: { ...state.paginatedObj, full: false }
      }
    case FETCH_PAGINATED_USERS_SUCCESS:
      if (action.payload.page === 0) {
        return { ...state,
          paginatedUsers: [{ list: action.payload.users }],
          paginatedObj: {
            ...state.paginatedObj,
            offset: action.payload.users.length,
            loading: false,
          }
        }
      }

      if (action.payload.users.length === 0) {
        return { ...state,
          paginatedObj: {
            ...state.paginatedObj,
            loading: false,
            full: true
          }
        }
      }

      return { ...state,
        paginatedUsers: [...state.paginatedUsers, { list: action.payload.users }],
        paginatedObj: {
          offset: state.paginatedObj.offset + action.payload.users.length,
          page: action.payload.page + 1,
          loading: false
        }
      }
    case FETCH_USER_INTRO_SUCCESS:
      return { ...state, [action.params.username]: JSON.parse(action.payload) }
    default:
      return state
  }
}
