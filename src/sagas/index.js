import { fork } from 'redux-saga/effects'
import userSaga from 'sagas/user'
import blockstackSaga from 'sagas/blockstack'
import shareSaga from 'sagas/share'
import followSaga from 'sagas/follow'

export default function* rootSaga() {
  yield [
    fork(userSaga),
    fork(blockstackSaga),
    fork(shareSaga),
    fork(followSaga),
  ]
}
