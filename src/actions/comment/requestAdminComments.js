import { REQUEST_ADMIN_COMMENTS } from 'actions'

const requestShareComments = ({ parent_creator, limit = 10, lt }) => {
  return {
    type: REQUEST_ADMIN_COMMENTS,
    payload: {
      parent_creator,
      limit,
      lt,
    }
  }
}

export default requestShareComments
