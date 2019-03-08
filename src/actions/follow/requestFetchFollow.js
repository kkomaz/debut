import { REQUEST_FETCH_FOLLOW } from 'actions'

const requestFetchFollow = (username) => {
  return { type: REQUEST_FETCH_FOLLOW, payload: { username } }
};

export default requestFetchFollow
