import { REQUEST_ADD_VOTE } from 'actions'

const requestAddVote = (username, share) => {
  return { type: REQUEST_ADD_VOTE, payload: {
    username,
    share,
  }}
}

export default requestAddVote
