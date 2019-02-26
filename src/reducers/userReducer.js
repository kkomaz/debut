import {
  REQUEST_SINGLE_USER,
  REQUEST_PAGINATED_USERS,
  REVERT_PAGINATED_USERS_FULL,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_PAGINATED_USERS_SUCCESS,
  FETCH_SINGLE_USER_SUCCESS,
  SET_BASIC_INFO_SUCCESS,
} from 'actions'
import {
  filterListFromList,
  updateObjFromList,
} from 'reducers/utils'
import toggleNotification from 'utils/notifier/toggleNotification'

const defaultSession = {
  users: [],
  paginatedUsers: [
    { list: [] }
  ],
  paginatedObj: {
    offset: 0,
    loading: true,
    full: false,
  },
  loading: true
}

export default function userReducer(state = defaultSession, action) {
  switch (action.type) {
    case FETCH_ALL_USERS_SUCCESS:
      return { ...state, users: filterListFromList(state.users, action.payload.users)}
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
    case REQUEST_SINGLE_USER:
      return { ...state, loading: true }
    case FETCH_SINGLE_USER_SUCCESS:
      return { ...state,
        users: updateObjFromList(state.users, action.payload),
        loading: false,
      }
    case SET_BASIC_INFO_SUCCESS:
      const searchedUser = state.users.find((user) => user._id === action.payload.username)
      const updatedUser = { ...searchedUser, basicInformation: action.payload.basicInformation }
      toggleNotification('success', `${updatedUser.username}'s bio successfully updated!`)
      return { ...state, users: updateObjFromList(state.users, updatedUser)}
    default:
      return state
  }
}
