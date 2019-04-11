import { REQUEST_MENTIONS } from 'actions'

const requestMentions = ({ username, limit = 10, lt }) => {
  return {
    type: REQUEST_MENTIONS,
    payload: {
      username,
      limit,
      lt
    }
  }
}

export default requestMentions
