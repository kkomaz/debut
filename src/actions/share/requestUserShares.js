import { REQUEST_USER_SHARES } from 'actions'

const requestUserShares = ({ username, offset = 0 }) => {
  return { type: REQUEST_USER_SHARES, payload: { username, offset } }
}

export default requestUserShares
