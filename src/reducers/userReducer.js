import {
  REQUEST_SINGLE_USER,
  REQUEST_PAGINATED_USERS,
  REQUEST_SET_USER_AVATAR,
  REVERT_PAGINATED_USERS_FULL,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_PAGINATED_USERS_SUCCESS,
  FETCH_SINGLE_USER_SUCCESS,
  FETCH_SINGLE_USER_FAIL,
  SET_BASIC_INFO_SUCCESS,
  SET_USER_AVATAR_FAIL,
  SET_USER_AVATAR_SUCCESS,
} from 'actions'
import {
  filterListFromList,
  updateOrAddObjFromList,
} from 'reducers/utils'
import _ from 'lodash'
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
  loading: true,
  avatarLoading: false,
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
    case FETCH_SINGLE_USER_FAIL:
      return { ...state, loading: false }
    case FETCH_SINGLE_USER_SUCCESS:
      return { ...state,
        users: updateOrAddObjFromList(state.users, action.payload),
        loading: false,
      }
    case SET_BASIC_INFO_SUCCESS:
      toggleNotification('success', `${action.payload.username}'s bio successfully updated!`)
      return { ...state, users: updateOrAddObjFromList(state.users, action.payload.user)}
    case REQUEST_SET_USER_AVATAR:
      return { ...state, avatarLoading: true }
    case SET_USER_AVATAR_FAIL:
      toggleNotification('error', action.error)
      return { ...state, avatarLoading: false }
    case SET_USER_AVATAR_SUCCESS:
      toggleNotification('success', `${action.payload.username}'s avatar successfully updated!`)
      let paginated
      const updatedPaginatedUsers = state.paginatedUsers

      _.each(state.paginatedUsers, (users, index) => {
        if (_.find(users.list, (user) => user._id === action.payload._id)) {
          paginated = {
            list: users.list,
            index
          }
        }
      })

      if (paginated) {
        const paginatedIndex = paginated.index
        const updatedList = updateOrAddObjFromList(paginated.list, action.payload)
        updatedPaginatedUsers[paginatedIndex] = { list: updatedList }
      }

      return { ...state,
        users: updateOrAddObjFromList(state.users, action.payload),
        paginatedUsers: updatedPaginatedUsers,
        avatarLoading: false,
      }
    default:
      return state
  }
}
