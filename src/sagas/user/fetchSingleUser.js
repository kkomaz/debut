import { put, call } from 'redux-saga/effects'
import { FETCH_SINGLE_USER_SUCCESS, FETCH_SINGLE_USER_FAIL } from 'actions'
import DebutUser from 'model/debutUser'

const fetchSingleUser = async (action) => {
  const user = await DebutUser.findOne({ username: action.payload.username })
  const debutUser = await user.addBasicInfo()
  return debutUser
}

function* fetchSingleUserSaga(action) {
  try {
    const user = yield call(fetchSingleUser, action)
    yield put({ type: FETCH_SINGLE_USER_SUCCESS, payload: user })
  } catch (error) {
    console.log(error.message)
    yield put({ type: FETCH_SINGLE_USER_FAIL });
  }
}

export default fetchSingleUserSaga
