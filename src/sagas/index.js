import { fork } from 'redux-saga/effects'
import userSaga from 'sagas/user'
import blockstackSaga from 'sagas/blockstack'
import commentSaga from 'sagas/comment'
import shareSaga from 'sagas/share'
import followSaga from 'sagas/follow'
import feedSaga from 'sagas/feed'

export default function* rootSaga() {
  yield [
    fork(blockstackSaga),
    fork(commentSaga),
    fork(followSaga),
    fork(shareSaga),
    fork(userSaga),
    fork(feedSaga),
  ]
}
