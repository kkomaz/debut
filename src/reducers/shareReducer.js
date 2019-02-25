import {
  REQUEST_USER_SHARES,
  FETCH_USER_SHARES_SUCCESS,
  FETCH_USER_SHARES_FAIL,
  CREATE_SHARE_SUCCESS,
  CREATE_SHARE_FAIL,
  EDIT_SHARE_SUCCESS,
  EDIT_SHARE_FAIL,
  DELETE_SHARE_SUCCESS,
} from 'actions'
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
      toggleNotification('success', 'Moment successfully edited')
      const sharesList = updateSingleObjectFromList(action.payload, state.shares.list)
      return { ...state, shares: { ...state.shares, list: sharesList }}
    case DELETE_SHARE_SUCCESS:
      return { ...state, shares: { ...state.shares, list: removeObjFromList(state.shares.list, action.payload)}}
    case FETCH_USER_SHARES_FAIL:
    case EDIT_SHARE_FAIL:
    case CREATE_SHARE_FAIL:
      toggleNotification('error', action.payload)
      return state
    default:
      return state
  }
}
