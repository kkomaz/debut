import Dapp from 'model/Dapp'
import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { FETCH_BLOCKSTACK_DAPPS_SUCCESS, FETCH_BLOCKSTACK_DAPPS_FAIL } from 'actions'

const fetchBlockstackDapps = (action) => {
  return Dapp.fetchList()
}

function* fetchBlockstackDappsSaga(action) {
  try {
    const data = yield call(fetchBlockstackDapps, action)
    const dapps = _.map(data, 'attrs')

    if (!data) {
      throw new Error('Data does not exist')
    }
    yield put({ type: FETCH_BLOCKSTACK_DAPPS_SUCCESS, payload: dapps })
  } catch (error) {
    yield put({ type: FETCH_BLOCKSTACK_DAPPS_FAIL, payload: error.message })
  }
}

export default fetchBlockstackDappsSaga
