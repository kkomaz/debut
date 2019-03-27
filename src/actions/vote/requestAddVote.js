import { REQUEST_ADD_VOTE } from 'actions'

const requestAddVote = (username, shareId) => {
  return { type: REQUEST_ADD_VOTE, payload: {
    username,
    shareId,
  }}
}

export default requestAddVote
