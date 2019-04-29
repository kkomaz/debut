import { takeLatest } from 'redux-saga/effects'
import {
  REQUEST_CREATE_TASK,
  REQUEST_DELETE_TASK,
  REQUEST_FETCH_TASKS,
} from 'actions'

import createTask from './createTask'
import deleteTask from './deleteTask'
import fetchTasks from './fetchTasks'

export default function* taskSaga() {
  yield [
    takeLatest(REQUEST_CREATE_TASK, createTask),
    takeLatest(REQUEST_DELETE_TASK, deleteTask),
    takeLatest(REQUEST_FETCH_TASKS, fetchTasks)
  ]
}
