import {
  FETCH_USER_SHARES_SUCCESS,
  CREATE_SHARE_SUCCESS
} from 'actions'
import { filterListFromList } from 'reducers/utils'

const defaultSession = {
  shares: {
    list: [],
    full: false
  }
}

export default function shareReducer(state = defaultSession, action) {
  switch(action.type) {
    case FETCH_USER_SHARES_SUCCESS:
      const newShares = action.payload
      return { ...state, shares: {
        list: filterListFromList(state.shares.list, newShares),
        full: newShares.length === 0
      }}
    case CREATE_SHARE_SUCCESS:
      return { ...state, shares: [action.payload, ...state.shares]}
    default:
      return state
  }
}
