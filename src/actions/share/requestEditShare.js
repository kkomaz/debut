import { REQUEST_EDIT_SHARE } from 'actions'

const requestEditShare = (id, params) => {
  return { type: REQUEST_EDIT_SHARE, params, id }
}

export default requestEditShare
