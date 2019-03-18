import {
  REQUEST_FETCH_SHARE_FEEDS,
  FETCH_SHARE_FEEDS_SUCCESS,
  REQUEST_ADD_SHARE_FEEDS,
} from 'actions'
import {
  filterListFromList,
} from 'reducers/utils'

const defaultState = {
  shares: {
    list: [],
    full: false,
    loading: true
  }
}

export default function feedReducer(state = defaultState, action) {
  switch (action.type) {
    case REQUEST_ADD_SHARE_FEEDS: {
      return { ...state, shares: {
        ...state.shares,
        list: [action.payload, ...state.shares.list]
      }}
    }
    case REQUEST_FETCH_SHARE_FEEDS: {
      return { ...state, shares: {
        ...state.shares,
        loading: true
      }}
    }
    case FETCH_SHARE_FEEDS_SUCCESS: {
      const list = filterListFromList(state.shares.list, action.payload)
      return { ...state, shares: {
        ...state.shares,
        list,
      }}
    }
    default: {
      return state
    }
  }
}
