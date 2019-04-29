import { CREATE_TASK_SUCCESS, CREATE_TASK_FAIL } from 'actions'
import { put, call } from 'redux-saga/effects'
import Task from 'model/task'

const createTask = async (action) => {
  const task = new Task(action.payload)
  await task.save()

  return { ...task.attrs, _id: task._id }
}

function* createTaskSaga(action) {
  try {
    const task = yield call(createTask, action)
    yield put({ type: CREATE_TASK_SUCCESS, payload: task })
  } catch (error) {
    yield put({ type: CREATE_TASK_FAIL, payload: error.message })
  }
}

export default createTaskSaga
