import {
  SET_VIEW,
} from 'actions'

const defaultState = {
  view: null,
}

export default function viewReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_VIEW: {
      return { ...state, data: action.payload }
    }
    default:
      return state
  }
}
