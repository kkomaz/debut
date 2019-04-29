import Task from 'model/task'
import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import {
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAIL,
} from 'actions'

const fetchTasks = async (action) => {
  const tasks = await Task.fetchList({
    month: action.payload.month,
    username: action.payload.username,
  })

  return _.map(tasks, 'attrs')
}

function *fetchTasksSaga(action) {
  try {
    const tasks = yield call(fetchTasks, action)

    yield put({
      type: FETCH_TASKS_SUCCESS,
      payload: tasks
    })
  } catch (error) {
    yield put({
      type: FETCH_TASKS_FAIL,
      payload: error.message
    })
  }
}

export default fetchTasksSaga
