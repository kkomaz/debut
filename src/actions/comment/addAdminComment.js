import { ADD_ADMIN_COMMENT } from 'actions'

const addAdminComment = (comment) => {
  return { type: ADD_ADMIN_COMMENT, payload: comment }
}

export default addAdminComment
