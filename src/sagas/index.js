import { fork } from 'redux-saga/effects'
import userSaga from 'sagas/user'
import blockstackSaga from 'sagas/blockstack'

export default function* rootSaga() {
  yield [
    fork(userSaga),
    fork(blockstackSaga)
  ]
}
