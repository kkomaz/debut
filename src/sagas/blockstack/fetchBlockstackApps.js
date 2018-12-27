import axios from 'axios'
import { put, call } from 'redux-saga/effects'
import { FETCH_BLOCKSTACK_APPS_SUCCESS, FETCH_BLOCKSTACK_APPS_FAIL } from 'actions'

const fetchBlockstackApps = (action) => {
  return axios.get('https://debut-3fcee.firebaseio.com/blockstack-apps.json')
}

function* fetchBlockstackAppsSaga(action) {
  try {
    const { data } = yield call(fetchBlockstackApps, action)

    if (!data) {
      throw new Error('Data does not exist')
    }

    yield put({ type: FETCH_BLOCKSTACK_APPS_SUCCESS, payload: data })
  } catch (error) {
    yield put({ type: FETCH_BLOCKSTACK_APPS_FAIL, payload: error.message })
  }
}

export default fetchBlockstackAppsSaga
