import {
  REQUEST_FETCH_SHARE_FEEDS,
  HANDLE_DETAIL_SHARE,
  REMOVE_DETAIL_SHARE,
  REQUEST_DISPLAY_HIDDEN_SHARES,
  RESET_SHARES_LOADING,
  REQUEST_USER_SHARES,
  REQUEST_CREATE_SHARE,
  REQUEST_DELETE_SHARE,
  REQUEST_EDIT_SHARE,
  REQUEST_CREATE_COMMENT,
  FETCH_USER_SHARES_SUCCESS,
  FETCH_USER_SHARES_FAIL,
  CREATE_SHARE_SUCCESS,
  CREATE_SHARE_FAIL,
  EDIT_SHARE_SUCCESS,
  EDIT_SHARE_FAIL,
  DELETE_SHARE_SUCCESS,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
  FETCH_SHARE_COMMENTS_SUCCESS,
  EDIT_COMMENT_SUCCESS,
  REQUEST_DELETE_COMMENT,
  REQUEST_EDIT_COMMENT,
  FETCH_SHARE_FEEDS_SUCCESS,
  REQUEST_ADD_SHARE_FEEDS,
} from 'actions'
import _ from 'lodash'
import {
  filterListFromList,
  removeObjFromList
} from 'reducers/utils'
import toggleNotification from 'utils/notifier/toggleNotification'

const defaultSession = {
  shares: {
    list: [],
    full: false,
    loading: true,
  },
  shareActions: {
    submitting: false,
    deleting: false,
    editing: false,
    added: false,
  },
  commentActions: {
    submitting: false,
    deleting: false,
    editing: false,
    shareId: '',
    commentId: ''
  }
}

function updateSingleObjectFromList(payload, list) {
  const updatedList = list.reduce((acc, current) => {
    if (current._id === payload._id) {
      return [
        ...acc,
        payload
      ];
    }
    return [
      ...acc,
      current,
    ];
  }, []);

  return updatedList
}

export default function shareReducer(state = defaultSession, action) {
  switch(action.type) {
    case REQUEST_FETCH_SHARE_FEEDS:
      return { ...state, shares: { ...state.shares,
        list: [],
        loading: true,
      }}
    case RESET_SHARES_LOADING:
    case REQUEST_USER_SHARES:
      return { ...state, shares: { ...state.shares, loading: true }}
    case FETCH_USER_SHARES_SUCCESS:
      const newShares = action.payload
      return { ...state, shares: {
        list: filterListFromList(state.shares.list, newShares),
        full: newShares.length === 0,
        loading: false
      }}
    case FETCH_SHARE_FEEDS_SUCCESS: {
      const newShares = action.payload
      return { ...state, shares: {
        list: filterListFromList(state.shares.list, newShares),
        full: newShares.length === 0,
        loading: false
      }}
    }
    case REQUEST_DISPLAY_HIDDEN_SHARES : {
      const list = _.map(state.shares.list, (share) => {
        if (share.hidden) {
          return { ...share, hidden: false }
        }
        return share
      })
      return { ...state, shares: {
        ...state.shares,
        list,
        loading: false
      }}
    }
    case REQUEST_ADD_SHARE_FEEDS: {
      const share = { ...action.payload, hidden: action.hidden }
      return { ...state, shares: {
        ...state.shares,
        list: [share, ...state.shares.list],
        loading: false
      }}
    }
    case HANDLE_DETAIL_SHARE: {
      const share = _.find(state.shares.list, (share) => share._id === action.payload._id)

      if (!share) {
        return { ...state,
          shares: {
            ...state.shares,
            list: [action.payload, ...state.shares.list],
            loading: false
          },
          shareActions: {
            ...state.shareActions,
            added: true,
          }
        }
      }

      return state
    }
    case REMOVE_DETAIL_SHARE: {
      if (state.shareActions.added) {
        const filteredList = _.filter(state.shares.list, (share) => share._id !== action.payload._id)
        return { ...state,
          shares: {
            ...state.shares,
            list: filteredList,
            loading: false,
          },
          shareActions: {
            ...state.shareActions,
            added: false
          }
        }
      }

      return state
    }
    case CREATE_SHARE_SUCCESS:
      toggleNotification('success', 'Moment successfully created')
      return { ...state,
        shares: { ...state.shares, list: [action.payload, ...state.shares.list]},
        shareActions: { ...state.shareActions, submitting: false }
      }
    case EDIT_SHARE_SUCCESS:
      toggleNotification('success', 'Moment successfully updated')
      const sharesList = updateSingleObjectFromList(action.payload, state.shares.list)
      return { ...state,
        shares: { ...state.shares, list: sharesList },
        shareActions: { ...state.shareActions, editing: false }
      }
    case DELETE_SHARE_SUCCESS:
      return { ...state,
        shares: { ...state.shares, list: removeObjFromList(state.shares.list, action.payload) },
        shareActions: { ...state.shareActions, deleting: false }
      }
    case FETCH_SHARE_COMMENTS_SUCCESS:
      const fetchedShare = _.find(state.shares.list, (share) => share._id === action.payload.share_id)
      const fetchedShareComments = _.get(fetchedShare, 'comments', [])
      const fetchedUpdatedShare = { ...fetchedShare, comments: [...action.payload.comments, ...fetchedShareComments ]}
      const fetchedUpdatedSharesList = updateSingleObjectFromList(fetchedUpdatedShare, state.shares.list)
      return { ...state, shares: { ...state.shares, list: fetchedUpdatedSharesList }}
    case CREATE_COMMENT_SUCCESS:
      const share = _.find(state.shares.list, (share) => share._id === action.payload.share_id)
      const shareComments = _.get(share, 'comments', [])
      const updatedShare = { ...share, comments: [...shareComments, action.payload ], commentCount: share.commentCount ? share.commentCount + 1 : 1 }
      const updatedSharesList = updateSingleObjectFromList(updatedShare, state.shares.list)
      toggleNotification('success', 'Comment successfully created')
      return { ...state,
        shares: { ...state.shares, list: updatedSharesList },
        commentActions: { ...state.commentActions, submitting: false }
      }
    case DELETE_COMMENT_SUCCESS: {
      const share = _.find(state.shares.list, (share) => share._id === action.payload.share_id)
      const shareComments = _.get(share, 'comments', [])
      const filteredComments = removeObjFromList(shareComments, action.payload)
      const updatedShare = { ...share, comments: filteredComments, commentCount: share.commentCount - 1 }
      const updatedShareList = updateSingleObjectFromList(updatedShare, state.shares.list)
      toggleNotification('success', 'Comment successfully deleted')
      return { ...state,
        shares: { ...state.shares, list: updatedShareList },
        commentActions: { ...state.commentActions, deleting: false }
      }
    }
    case EDIT_COMMENT_SUCCESS: {
      const share = _.find(state.shares.list, (share) => share._id === action.payload.share_id)
      const shareComments = _.get(share, 'comments', [])
      const updatedComments = updateSingleObjectFromList(action.payload, shareComments)
      const updatedShare = { ...share, comments: updatedComments }
      const updatedShareList = updateSingleObjectFromList(updatedShare, state.shares.list)
      toggleNotification('success', 'Comment successfully updated')
      return { ...state,
        shares: { ...state.shares, list: updatedShareList },
        commentActions: { ...state.commentActions, editing: false }
      }
    }
    case REQUEST_CREATE_SHARE:
      return { ...state, shareActions: { ...state.shareActions, submitting: true }}
    case REQUEST_DELETE_SHARE:
      return { ...state, shareActions: { ...state.shareActions, deleting: true }}
    case REQUEST_EDIT_SHARE:
      return { ...state, shareActions: { ...state.shareActions, editing: true }}
    case REQUEST_EDIT_COMMENT: {
      return { ...state, commentActions: { ...state.commentActions, editing: true }}
    }
    case REQUEST_DELETE_COMMENT: {
      return { ...state, commentActions: { ...state.commentActions, deleting: true, commentId: action.payload.comment._id }}
    }
    case REQUEST_CREATE_COMMENT: {
      return { ...state, commentActions: { ...state.commentActions, submitting: true, shareId: action.payload.shareId }}
    }
    case FETCH_USER_SHARES_FAIL:
    case EDIT_SHARE_FAIL:
    case CREATE_SHARE_FAIL:
      toggleNotification('error', action.payload)
      return state
    default:
      return state
  }
}
