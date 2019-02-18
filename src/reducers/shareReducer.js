import {
  REQUEST_USER_SHARES,
  FETCH_USER_SHARES_SUCCESS,
  CREATE_SHARE_SUCCESS,
  EDIT_SHARE_SUCCESS,
} from 'actions'
import { filterListFromList } from 'reducers/utils'

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
      return { ...state, shares: { ...state.shares, list: [action.payload, ...state.shares.list]}}
    case EDIT_SHARE_SUCCESS:
      const sharesList = updateSingleObjectFromList(action.payload, state.shares.list)
      return { ...state, shares: { ...state.shares, list: sharesList }}
    default:
      return state
  }
}
