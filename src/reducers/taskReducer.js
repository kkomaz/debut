import {
  TASK_CREATE_TWITTER_SUCCESS,
  FETCH_TASKS_SUCCESS,
} from 'actions'
import { filterListFromList } from './utils'

const defaultState = {
  list: [],
}

export default function taskReducer(state = defaultState, action) {
  switch (action.type) {
    case TASK_CREATE_TWITTER_SUCCESS: {
      return { ...state, list: [...state.list, action.payload] }
    }
    case FETCH_TASKS_SUCCESS: {
      return { ...state, list: filterListFromList(state.list, action.payload)}
    }
    default: {
      return state
    }
  }
}
