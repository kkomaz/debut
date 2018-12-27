import { FETCH_BLOCKSTACK_APPS_SUCCESS } from 'actions'

const defaultSession = {
  apps: []
}

export default function blockstack(state = defaultSession, action) {
  switch (action.type) {
    case FETCH_BLOCKSTACK_APPS_SUCCESS:
      return { ...state, apps: action.payload }
    default:
      return state
  }
}
