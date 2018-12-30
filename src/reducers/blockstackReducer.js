import { FETCH_BLOCKSTACK_APPS_SUCCESS } from 'actions'

const defaultSession = {
  apps: [],
  loading: true
}

export default function blockstack(state = defaultSession, action) {
  switch (action.type) {
    case FETCH_BLOCKSTACK_APPS_SUCCESS:
      return { ...state, apps: action.payload, loading: false }
    default:
      return state
  }
}
