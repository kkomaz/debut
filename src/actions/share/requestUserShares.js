import { REQUEST_USER_SHARES } from 'actions'

const requestUserShares = (username) => {
  return { type: REQUEST_USER_SHARES, payload: username }
}

export default requestUserShares
