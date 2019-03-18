import {
  FETCH_FOLLOW_SUCCESS,
  REQUEST_UNFOLLOW,
  REQUEST_FOLLOW,
  REQUEST_FETCH_FOLLOW,
  SET_FOLLOW_SUCCESS,
  SET_UNFOLLOW_SUCCESS,
} from 'actions'

const defaultState = {
  loading: true
}

export default function followReducer(state = defaultState, action) {
  switch(action.type) {
    case REQUEST_FETCH_FOLLOW:
    case REQUEST_FOLLOW:
    case REQUEST_UNFOLLOW:
      return { ...state, loading: true }
    case FETCH_FOLLOW_SUCCESS:
      return { ...state,
        [action.payload.username]: action.payload.follow,
        loading: false,
      }
    case SET_UNFOLLOW_SUCCESS:
    case SET_FOLLOW_SUCCESS:
      return { ...state,
        [action.payload.following.username]: action.payload.following,
        [action.payload.followers.username]: action.payload.followers,
        loading: false,
      }
    default:
      return state
  }
}
