import {
  FETCH_BLOCKSTACK_DAPPS_FAIL,
  FETCH_BLOCKSTACK_DAPPS_SUCCESS,
  FETCH_PROFILE_SEARCH_SUCCESS,
} from 'actions'

const defaultSession = {
  dapps: {
    list: [],
    loading: true,
  },
  searchedProfile: {},
}

export default function blockstack(state = defaultSession, action) {
  switch (action.type) {
    case FETCH_BLOCKSTACK_DAPPS_SUCCESS:
      return { ...state, dapps: {
        list: action.payload,
        loading: false,
      }}
    case FETCH_BLOCKSTACK_DAPPS_FAIL:
      return { ...state, dapps: {
        ...state.dapps, loading: false
      }}
    case FETCH_PROFILE_SEARCH_SUCCESS:
      return { ...state, searchedProfile: action.payload }
    default:
      return state
  }
}
