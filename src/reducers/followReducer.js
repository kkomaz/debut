import {
  FETCH_FOLLOW_SUCCESS
} from 'actions'

const defaultState = {}

export default function followReducer(state = defaultState, action) {
  switch(action.type) {
    case FETCH_FOLLOW_SUCCESS:
      return { ...state, [action.payload.username]: action.payload.follow }
    default:
      return state
  }
}
