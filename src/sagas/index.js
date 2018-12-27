import { fork } from 'redux-saga/effects'
import userSaga from 'sagas/user'

export default function* rootSaga() {
  yield [
    fork(userSaga)
  ]
}
