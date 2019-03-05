import { REQUEST_FETCH_FOLLOW } from 'actions'

const requestFetchFollow = (username) => {
  console.log('hitting the request?')
  return { type: REQUEST_FETCH_FOLLOW, payload: { username } }
};

export default requestFetchFollow
