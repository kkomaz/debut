import {
  TASK_CREATE_TWITTER_SUCCESS,
} from 'actions'

const defaultState = {
  list: [],
}

export default function taskReducer(state = defaultState, action) {
  switch (action.type) {
    case TASK_CREATE_TWITTER_SUCCESS: {
      return { ...state, list: [...state.list, action.payload] }
    }
    default: {
      return state
    }
  }
}
