import { REQUEST_REMOVE_VOTE } from 'actions'

const requestRemoveVote = (voteId) => {
  return { type: REQUEST_REMOVE_VOTE, voteId}
}

export default requestRemoveVote
