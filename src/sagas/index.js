import { fork } from 'redux-saga/effects'
import userSaga from 'sagas/user'
import blockstackSaga from 'sagas/blockstack'
import shareSaga from 'sagas/share'

export default function* rootSaga() {
  yield [
    fork(userSaga),
    fork(blockstackSaga),
    fork(shareSaga)
  ]
}
