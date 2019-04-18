import { REQUEST_CREATE_COMMENT } from 'actions'

const requestCreateComment = (username, params, shareId) => {
  return { type: REQUEST_CREATE_COMMENT, payload: {
    username,
    params,
    shareId,
  }}
}

export default requestCreateComment
