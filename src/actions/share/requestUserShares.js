import { REQUEST_USER_SHARES } from 'actions'

const requestUserShares = ({ username, lt }) => {
  return {
    type: REQUEST_USER_SHARES,
    payload: {
      username,
      lt,
    }
  }
}

export default requestUserShares
