import { REQUEST_REMOVE_VOTE } from 'actions'

const requestRemoveVote = (share, vote) => {
  return { type: REQUEST_REMOVE_VOTE, payload: {
    share,
    vote,
  }}
}

export default requestRemoveVote
