import { put, call } from 'redux-saga/effects'
import { FETCH_USER_SHARES_SUCCESS, FETCH_USER_SHARES_FAIL } from 'actions'
import axios from 'axios'

const fetchUserShares = async (action) => {
  const { username, lt } = action.payload

  const { data } = await axios.get('/shares', {
    params: {
      username: [username],
      limit: 5,
      lt,
    }
  })

  const shares = data.shares
  return shares
}

function* fetchUserSharesSaga(action) {
  try {
    const shares = yield call(fetchUserShares, action)

    yield put({ type: FETCH_USER_SHARES_SUCCESS, payload: shares })
  } catch (error) {
    yield put({ type: FETCH_USER_SHARES_FAIL, payload: error.message })
  }
}

export default fetchUserSharesSaga
