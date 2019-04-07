import {
  REQUEST_ADMIN_COMMENTS,
  FETCH_ADMIN_COMMENTS_SUCCESS,
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
    case REQUEST_ADMIN_COMMENTS: {
      return {
        ...state, comments: {
          ...state.comments, loading: true,
        }
      }
    }
    case FETCH_ADMIN_COMMENTS_SUCCESS: {
      return {
        ...state, comments: {
          ...state.comments,
          list: filterListFromList(state.comments.list, action.payload.comments)
        }
      }
    }
    default:
      return state
  }
}
