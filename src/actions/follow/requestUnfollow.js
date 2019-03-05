import { REQUEST_UNFOLLOW } from 'actions'

const requestUnfollow = (sessionUsername, username, following, followers) => {
  return { type: REQUEST_UNFOLLOW, payload: {
    sessionUsername,
    username,
    following,
    followers
  } }
};

export default requestUnfollow
