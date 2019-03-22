import { REMOVE_DETAIL_SHARE } from 'actions'

const removeDetailShare = (share) => {
  return {
    type: REMOVE_DETAIL_SHARE,
    payload: share,
  }
}

export default removeDetailShare
