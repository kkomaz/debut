import {
  REQUEST_ADMIN_COMMENTS,
  FETCH_ADMIN_COMMENTS_SUCCESS,
  ADD_ADMIN_COMMENT,
} from 'actions'
import {
  filterListFromList,
} from 'reducers/utils'

const defaultState = {
  comments: {
    list: [],
    full: false,
    loading: true,
  }
}

export default function recentReducer(state = defaultState, action) {
  switch (action.type) {
    case ADD_ADMIN_COMMENT: {
      return {
        ...state, comments: {
          ...state.comments,
          list: [action.payload, ...state.comments.list]
        }
      }
    }
    case REQUEST_ADMIN_COMMENTS: {
      return {
        ...state, comments: {
          ...state.comments, loading: true,
        }
      }
    }
    case FETCH_ADMIN_COMMENTS_SUCCESS: {
      if (action.payload.comments.length === 0) {
        return {
          ...state, comments: {
            ...state.comments,
            full: true,
            loading: false,
          }
        }
      }
      return {
        ...state, comments: {
          ...state.comments,
          list: filterListFromList(state.comments.list, action.payload.comments),
          loading: false,
        }
      }
    }
    default:
      return state
  }
}
