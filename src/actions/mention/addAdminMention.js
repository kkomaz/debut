import { ADD_ADMIN_MENTION } from 'actions'

const addAdminMention = (comment) => {
  return { type: ADD_ADMIN_MENTION, payload: comment }
}

export default addAdminMention
