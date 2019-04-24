import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_TASK_CREATE_TWITTER,
} from 'actions'

import taskCreateTwitter from './taskCreateTwitter'

export default function* taskSaga() {
  yield [
    takeLatest(REQUEST_TASK_CREATE_TWITTER, taskCreateTwitter),
  ]
}
