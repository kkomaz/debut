import {
  TASK_CREATE_TWITTER_SUCCESS,
} from 'actions'

const defaultState = {}

export default function taskReducer(state = defaultState, action) {
  switch (action.type) {
    case TASK_CREATE_TWITTER_SUCCESS: {
      return state
    }
    default: {
      return state
    }
  }
}
