import { REQUEST_CREATE_COMMENT } from 'actions'

const requestCreateComment = (params) => {
  return { type: REQUEST_CREATE_COMMENT, params }
}

export default requestCreateComment
