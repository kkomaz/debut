import { REQUEST_ADD_CONTACTS_TO_FOLLOW } from 'actions'

const requestAddContactsToFollow = (username) => {
  return { type: REQUEST_ADD_CONTACTS_TO_FOLLOW, payload: { username } }
};

export default requestAddContactsToFollow
