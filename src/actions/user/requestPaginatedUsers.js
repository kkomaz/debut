import { REQUEST_PAGINATED_USERS } from 'actions'

const requestPaginatedUsers = (page, offset = 0) => {
  return {
    type: REQUEST_PAGINATED_USERS,
    payload: {
      offset,
      page,
    }
  }
}

export default requestPaginatedUsers
