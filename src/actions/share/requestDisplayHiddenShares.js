import { REQUEST_DISPLAY_HIDDEN_SHARES } from 'actions'

const requestDisplayHiddenShares = (share) => {
  return {
    type: REQUEST_DISPLAY_HIDDEN_SHARES,
    payload: share
  }
}

export default requestDisplayHiddenShares
