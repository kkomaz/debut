import axios from 'axios'
import { put, call } from 'redux-saga/effects'
import { FETCH_PROFILE_SEARCH_SUCCESS, FETCH_PROFILE_SEARCH_FAIL } from 'actions'

const fetchProfileSearch = (action) => {
  return axios.get(`https://core.blockstack.org/v1/search?query=${action.payload}`)
}

function* fetchProfileSearchSaga(action) {
  try {
    const { data } = yield call(fetchProfileSearch, action)

    if (!data) {
      throw new Error('Data does not exist')
    }

    const profile = data.results[0].profile

    yield put({ type: FETCH_PROFILE_SEARCH_SUCCESS, payload: profile })
    return profile;
  } catch (error) {
    yield put({ type: FETCH_PROFILE_SEARCH_FAIL, payload: error.message })
  }
}

export default fetchProfileSearchSaga
