import { SET_VIEW } from 'actions'

const setView = (view, key) => {
  return {
    type: SET_VIEW,
    payload: {
      view,
      key
    }
  }
}

export default setView
