import { REMOVE_ADMIN_MENTION } from 'actions'

const removeAdminMention = (parent_id) => {
  return { type: REMOVE_ADMIN_MENTION, payload: parent_id }
}

export default removeAdminMention
