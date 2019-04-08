import {
  SET_VIEW,
} from 'actions'

const defaultState = {
  view: { empty: true },
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
