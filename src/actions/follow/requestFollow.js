import { REQUEST_FOLLOW } from 'actions'

const requestFollow = (sessionUsername, username, following, followers) => {
  return { type: REQUEST_FOLLOW, payload: {
    sessionUsername,
    username,
    following,
    followers
  } }
};

export default requestFollow
