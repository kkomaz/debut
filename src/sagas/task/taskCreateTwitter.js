import { TASK_CREATE_TWITTER_SUCCESS, TASK_CREATE_TWITTER_FAIL } from 'actions'
import { put, call } from 'redux-saga/effects'
import Task from 'model/task'

const taskCreateTwitter = async (action) => {
  const task = new Task(action.payload)
  await task.save()

  return { ...task.attrs, _id: task._id }
}

function* taskCreateTwitterSaga(action) {
  try {
    const task = yield call(taskCreateTwitter, action)
    yield put({ type: TASK_CREATE_TWITTER_SUCCESS, payload: task })
  } catch (error) {
    yield put({ type: TASK_CREATE_TWITTER_FAIL, payload: error.message })
  }
}

export default taskCreateTwitterSaga
