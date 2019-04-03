import { REQUEST_ADD_VOTE } from 'actions'

const requestAddVote = (detailObj, username, type) => {
  return { type: REQUEST_ADD_VOTE, payload: {
    username,
    detailObj,
    type,
  }}
}

export default requestAddVote
