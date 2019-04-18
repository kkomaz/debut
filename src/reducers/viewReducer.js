import {
  SET_VIEW,
} from 'actions'

const defaultState = {
  comment: {
    initial: true,
  },
  mention: {
    initial: true,
  }
}

export default function viewReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_VIEW: {
      return { ...state, [action.payload.key]: action.payload.view }
    }
    default:
      return state
  }
}
