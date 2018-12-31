import axios from 'axios'
import { put, call } from 'redux-saga/effects'
import { FETCH_BLOCKSTACK_APPS_SUCCESS, FETCH_BLOCKSTACK_APPS_FAIL } from 'actions'
import { convertObjsToList } from 'utils/firebase'

const fetchBlockstackApps = (action) => {
  return axios.get('/dapps.json')
}

function* fetchBlockstackAppsSaga(action) {
  try {
    const { data } = yield call(fetchBlockstackApps, action)

    if (!data) {
      throw new Error('Data does not exist')
    }

    const dapps = convertObjsToList(data)

    yield put({ type: FETCH_BLOCKSTACK_APPS_SUCCESS, payload: dapps })
  } catch (error) {
    yield put({ type: FETCH_BLOCKSTACK_APPS_FAIL, payload: error.message })
  }
}

export default fetchBlockstackAppsSaga
