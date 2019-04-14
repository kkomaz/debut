import { REMOVE_ADMIN_COMMENT } from 'actions'

const removeAdminComment = (comment) => {
  return { type: REMOVE_ADMIN_COMMENT, payload: comment }
}

export default removeAdminComment
