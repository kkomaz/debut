import {
  FETCH_BLOCKSTACK_DAPPS_FAIL,
  FETCH_BLOCKSTACK_DAPPS_SUCCESS,
  ADD_DAPPS_TO_LIST,
} from 'actions'

const defaultSession = {
  dapps: {
    list: [],
    loading: true,
  },
}

export default function blockstack(state = defaultSession, action) {
  switch (action.type) {
    case ADD_DAPPS_TO_LIST:
      return { ...state, dapps: {
        list: [...state.dapps.list, ...action.payload],
        loading: false
      }}
    case FETCH_BLOCKSTACK_DAPPS_SUCCESS:
      return { ...state, dapps: {
        list: action.payload,
        loading: false,
      }}
    case FETCH_BLOCKSTACK_DAPPS_FAIL:
      return { ...state, dapps: {
        ...state.dapps, loading: false
      }}
    default:
      return state
  }
}
