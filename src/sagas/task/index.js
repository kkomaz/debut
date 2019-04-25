import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_CREATE_TASK,
  REQUEST_FETCH_TASKS,
} from 'actions'

import createTask from './createTask'
import fetchTasks from './fetchTasks'

export default function* taskSaga() {
  yield [
    takeLatest(REQUEST_CREATE_TASK, createTask),
    takeLatest(REQUEST_FETCH_TASKS, fetchTasks)
  ]
}
