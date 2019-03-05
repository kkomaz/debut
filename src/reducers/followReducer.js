import {
  FETCH_FOLLOW_SUCCESS,
  SET_FOLLOW_SUCCESS,
} from 'actions'

const defaultState = {}

export default function followReducer(state = defaultState, action) {
  switch(action.type) {
    case FETCH_FOLLOW_SUCCESS:
      return { ...state, [action.payload.username]: action.payload.follow }
    case SET_FOLLOW_SUCCESS:
      return { ...state, [action.payload.username]: action.payload }
    default:
      return state
  }
}
