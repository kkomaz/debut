import { REQUEST_FOLLOW } from 'actions'

const requestFollow = (sessionUsername, username, following) => {
  return { type: REQUEST_FOLLOW, payload: { sessionUsername, username, following } }
};

export default requestFollow
