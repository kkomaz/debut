import { REQUEST_CREATE_COMMENT } from 'actions'

const requestCreateComment = (params, shareId) => {
  return { type: REQUEST_CREATE_COMMENT, payload: {
    params,
    shareId,
  }}
}

export default requestCreateComment
