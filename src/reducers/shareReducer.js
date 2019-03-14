import {
  REQUEST_USER_SHARES,
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
  comments: {
    submitting: false,
    deleting: false,
    editing: false,
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
    case REQUEST_USER_SHARES:
      return { ...state, shares: { ...state.shares, loading: true }}
    case FETCH_USER_SHARES_SUCCESS:
      const newShares = action.payload
      return { ...state, shares: {
        list: filterListFromList(state.shares.list, newShares),
        full: newShares.length === 0,
        loading: false
      }}
    case CREATE_SHARE_SUCCESS:
      toggleNotification('success', 'Moment successfully created')
      return { ...state, shares: { ...state.shares, list: [action.payload, ...state.shares.list]}}
    case EDIT_SHARE_SUCCESS:
      toggleNotification('success', 'Moment successfully updated')
      const sharesList = updateSingleObjectFromList(action.payload, state.shares.list)
      return { ...state, shares: { ...state.shares, list: sharesList }}
    case DELETE_SHARE_SUCCESS:
      return { ...state, shares: { ...state.shares, list: removeObjFromList(state.shares.list, action.payload) }}
    case CREATE_COMMENT_SUCCESS:
      const share = _.find(state.shares.list, (share) => share._id === action.payload.share_id)
      const shareComments = _.get(share, 'comments', [])
      const updatedShare = { ...share, comments: [...shareComments, action.payload ], commentCount: share.commentCount ? share.commentCount + 1 : 1 }
      const updatedSharesList = updateSingleObjectFromList(updatedShare, state.shares.list)
      toggleNotification('success', 'Comment successfully created')
      return { ...state, shares: { ...state.shares, list: updatedSharesList }, comments: { submitting: false }}
    case FETCH_SHARE_COMMENTS_SUCCESS:
      const fetchedShare = _.find(state.shares.list, (share) => share._id === action.payload.share_id)
      const fetchedShareComments = _.get(fetchedShare, 'comments', [])
      const fetchedUpdatedShare = { ...fetchedShare, comments: [...action.payload.comments, ...fetchedShareComments ]}
      const fetchedUpdatedSharesList = updateSingleObjectFromList(fetchedUpdatedShare, state.shares.list)
      return { ...state, shares: { ...state.shares, list: fetchedUpdatedSharesList }}
    case DELETE_COMMENT_SUCCESS: {
      const share = _.find(state.shares.list, (share) => share._id === action.payload.share_id)
      const shareComments = _.get(share, 'comments', [])
      const filteredComments = removeObjFromList(shareComments, action.payload)
      const updatedShare = { ...share, comments: filteredComments, commentCount: share.commentCount - 1 }
      const updatedShareList = updateSingleObjectFromList(updatedShare, state.shares.list)
      toggleNotification('success', 'Comment successfully deleted')
      return { ...state, shares: { ...state.shares, list: updatedShareList, comments: { deleting: false } }}
    }
    case EDIT_COMMENT_SUCCESS: {
      const share = _.find(state.shares.list, (share) => share._id === action.payload.share_id)
      const shareComments = _.get(share, 'comments', [])
      const updatedComments = updateSingleObjectFromList(action.payload, shareComments)
      const updatedShare = { ...share, comments: updatedComments }
      const updatedShareList = updateSingleObjectFromList(updatedShare, state.shares.list)
      toggleNotification('success', 'Comment successfully updated')
      return { ...state, shares: { ...state.shares, list: updatedShareList }, comments: { editing: false } }
    }
    case REQUEST_EDIT_COMMENT: {
      return { ...state, comments: { editing: true }}
    }
    case REQUEST_DELETE_COMMENT: {
      return { ...state, comments: { deleting: true }}
    }
    case REQUEST_CREATE_COMMENT: {
      return { ...state, comments: { submitting: true }}
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
