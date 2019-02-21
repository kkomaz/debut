import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import {
  FETCH_PAGINATED_USERS_SUCCESS,
  FETCH_PAGINATED_USERS_FAIL,
  FETCH_ALL_USERS_SUCCESS
} from 'actions'
import { User } from 'radiks'

const fetchPaginatedUsers = (action) => {
  return User.fetchList({
    sort: '-createdAt',
    limit: 2,
    offset: action.payload.offset,
  })
}

function* fetchPaginatedUsersSaga(action) {
  try {
    const radiksUsers = yield call(fetchPaginatedUsers, action);

    const users = _.map(radiksUsers, (user) => {
      return user.attrs
    })

    const payload = {
      users,
      offset: action.payload.offset,
      page: action.payload.page,
    }

    yield put({ type: FETCH_PAGINATED_USERS_SUCCESS, payload });
    yield put({ type: FETCH_ALL_USERS_SUCCESS, payload })
  } catch (error) {
    console.log(error.message)
    yield put({ type: FETCH_PAGINATED_USERS_FAIL });
  }
}

export default fetchPaginatedUsersSaga
