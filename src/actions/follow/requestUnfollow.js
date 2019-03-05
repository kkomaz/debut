import { REQUEST_UNFOLLOW } from 'actions'

const requestUnfollow = (sessionUsername, username, following) => {
  return { type: REQUEST_UNFOLLOW, payload: { sessionUsername, username, following } }
};

export default requestUnfollow
