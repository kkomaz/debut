import { DELETE_TASK_SUCCESS, DELETE_TASK_FAIL } from 'actions'
import { put, call } from 'redux-saga/effects'
import Task from 'model/task'

const deleteTask = async (action) => {
  const task = await Task.findById(action.payload)
  await task.destroy()

  return action.payload
}

function* deleteTaskSaga(action) {
  try {
    const taskId = yield call(deleteTask, action)
    yield put({ type: DELETE_TASK_SUCCESS, payload: taskId })
  } catch (error) {
    console.log(error.message)
    yield put({ type: DELETE_TASK_FAIL, payload: error.message })
  }
}

export default deleteTaskSaga
