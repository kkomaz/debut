import { SET_VIEW } from 'actions'

const setView = (view) => {
  return { type: SET_VIEW, payload: view }
}

export default setView
