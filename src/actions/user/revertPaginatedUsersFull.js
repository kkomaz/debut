import { REVERT_PAGINATED_USERS_FULL } from 'actions'

const revertPaginatedUsersFull = (page, offset = 0) => {
  return {
    type: REVERT_PAGINATED_USERS_FULL,
    payload: {
      offset,
      page,
    }
  }
}

export default revertPaginatedUsersFull
