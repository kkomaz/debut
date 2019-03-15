import { REQUEST_SHARE_COMMENTS } from 'actions'

const requestShareComments = ({ share_id, offset = 5 }) => {
  return {
    type: REQUEST_SHARE_COMMENTS,
    payload: {
      share_id,
      offset,
    }
  }
}

export default requestShareComments
