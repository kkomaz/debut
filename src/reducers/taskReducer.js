import {
  CREATE_TASK_SUCCESS,
  REQUEST_FETCH_TASKS,
  FETCH_TASKS_SUCCESS,
} from 'actions'
import { filterListFromList } from './utils'
import toggleNotification from 'utils/notifier/toggleNotification'

const defaultState = {
  list: [],
  loading: true,
}

export default function taskReducer(state = defaultState, action) {
  switch (action.type) {
    case REQUEST_FETCH_TASKS: {
      return { ...state, loading: true }
    }
    case CREATE_TASK_SUCCESS: {
      toggleNotification('success', 'Task Completed!')
      return { ...state, list: [...state.list, action.payload] }
    }
    case FETCH_TASKS_SUCCESS: {
      return { ...state,
        list: filterListFromList(state.list, action.payload),
        loading: false,
      }
    }
    default: {
      return state
    }
  }
}
