import { HANDLE_DETAIL_SHARE } from 'actions'

const handleDetailShare = (share) => {
  return {
    type: HANDLE_DETAIL_SHARE,
    payload: share,
  }
}

export default handleDetailShare
