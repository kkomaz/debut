import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_TASK_CREATE_TWITTER,
  REQUEST_FETCH_TASKS,
} from 'actions'

import taskCreateTwitter from './taskCreateTwitter'
import fetchTasks from './fetchTasks'

export default function* taskSaga() {
  yield [
    takeLatest(REQUEST_TASK_CREATE_TWITTER, taskCreateTwitter),
    takeLatest(REQUEST_FETCH_TASKS, fetchTasks)
  ]
}
