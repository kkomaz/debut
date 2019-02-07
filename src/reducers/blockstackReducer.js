import {
  FETCH_BLOCKSTACK_APPS_SUCCESS,
  FETCH_BLOCKSTACK_APPS_FAIL,
  FETCH_PROFILE_SEARCH_SUCCESS,
  FETCH_USER_INTRO_SUCCESS,
} from 'actions'

const defaultSession = {
  apps: [],
  loading: true,
  searchedProfile: {},
}

export default function blockstack(state = defaultSession, action) {
  switch (action.type) {
    case FETCH_BLOCKSTACK_APPS_SUCCESS:
      return { ...state, apps: action.payload, loading: false }
    case FETCH_BLOCKSTACK_APPS_FAIL:
      return { ...state, loading: false }
    case FETCH_PROFILE_SEARCH_SUCCESS:
      return { ...state, searchedProfile: action.payload }
    default:
      return state
  }
}
