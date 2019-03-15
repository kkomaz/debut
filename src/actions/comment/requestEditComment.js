import { REQUEST_EDIT_COMMENT } from 'actions'

const requestEditComment = (id, params) => {
  return { type: REQUEST_EDIT_COMMENT, payload: {
    id,
    params
  }}
}

export default requestEditComment
