import { REQUEST_REMOVE_VOTE } from 'actions'

const requestRemoveVote = (detailObj, vote, type) => {
  return { type: REQUEST_REMOVE_VOTE, payload: {
    detailObj,
    vote,
    type,
  }}
}

export default requestRemoveVote
