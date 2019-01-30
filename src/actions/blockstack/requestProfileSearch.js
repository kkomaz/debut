import { REQUEST_PROFILE_SEARCH } from 'actions'

const requestProfileSearch = (username) => {
  return { type: REQUEST_PROFILE_SEARCH, payload: username }
};

export default requestProfileSearch
