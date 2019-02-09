import {
  FETCH_USER_SHARES_SUCCESS,
} from 'actions'
import { filterListFromList } from 'reducers/utils'

const defaultSession = {
  shares: []
}

export default function shareReducer(state = defaultSession, action) {
  switch(action.type) {
    case FETCH_USER_SHARES_SUCCESS:
      const newShares = action.payload
      return { ...state, shares: filterListFromList(state.shares, newShares) }
    default:
      return state
  }
}
