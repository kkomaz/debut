import { REQUEST_DELETE_COMMENT } from 'actions'

const requestDeleteComment = (params) => {
  return { type: REQUEST_DELETE_COMMENT, payload: params }
}

export default requestDeleteComment
