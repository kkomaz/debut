import { put, call } from 'redux-saga/effects'
import { FETCH_USER_INTRO_SUCCESS, FETCH_USER_INTRO_FAIL } from 'actions'

const fetchUserIntro = (params) => {
  const { username, userSession } = params.payload
  const options = { decrypt: false, username }

  const result = userSession.getFile(`user-intro-${username}.json`, options)
  return result
}

function* fetchUserIntroSaga(action) {
  try {
    const data = yield call(fetchUserIntro, action)

    console.log('successful')

    if (!data) {
      throw new Error('Data does not exist')
    }

    yield put({ type: FETCH_USER_INTRO_SUCCESS, payload: data, params: action.payload })
  } catch (error) {
    console.log('erroring')
    yield put({ type: FETCH_USER_INTRO_FAIL, payload: error.message })
  }
}

export default fetchUserIntroSaga
