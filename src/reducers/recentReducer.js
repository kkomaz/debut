import _ from 'lodash'
import {
  REQUEST_ADMIN_COMMENTS,
  FETCH_ADMIN_COMMENTS_SUCCESS,
  ADD_ADMIN_COMMENT,
  REMOVE_ADMIN_COMMENT,
  ADD_ADMIN_MENTION,
  REMOVE_ADMIN_MENTION,
  REQUEST_MENTIONS,
  FETCH_MENTIONS_SUCCESS,
} from 'actions'
import {
  filterListFromList,
  removeObjFromList,
} from 'reducers/utils'

const defaultState = {
  comments: {
    list: [],
    full: false,
    loading: true,
  },
  mentions: {
    list: [],
    full: false,
    loading: true,
  }
}

export default function recentReducer(state = defaultState, action) {
  switch (action.type) {
    // Comment Start
    case ADD_ADMIN_COMMENT: {
      return {
        ...state, comments: {
          ...state.comments,
          list: [action.payload, ...state.comments.list]
        }
      }
    }
    case REMOVE_ADMIN_COMMENT: {
      return {
        ...state, comments: {
          ...state.comments,
          list: removeObjFromList(state.comments.list, action.payload)
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
    // Comment End

    // Mention Start
    case ADD_ADMIN_MENTION: {
      return {
        ...state, mentions: {
          ...state.mentions,
          list: [action.payload, ...state.mentions.list]
        }
      }
    }
    case REMOVE_ADMIN_MENTION: {
      return {
        ...state, mentions: {
          ...state.mentions,
          list: _.filter(state.mentions.list, (mention) => mention.parent_id !== action.payload)
        }
      }
    }
    case REQUEST_MENTIONS: {
      return {
        ...state, mentions: {
          ...state.mentions, loading: true,
        }
      }
    }
    case FETCH_MENTIONS_SUCCESS: {
      if (action.payload.mentions.length === 0) {
        return {
          ...state, mentions: {
            ...state.mentions,
            full: true,
            loading: false,
          }
        }
      }
      return {
        ...state, mentions: {
          ...state.mentions,
          list: filterListFromList(state.mentions.list, action.payload.mentions),
          loading: false,
        }
      }
    }
    default:
      return state
  }
}
