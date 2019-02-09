import _ from 'lodash'
import { put, call } from 'redux-saga/effects'
import { FETCH_USER_SHARES_SUCCESS, FETCH_USER_SHARES_FAIL } from 'actions'
import Share from 'model/share'

const fetchUserShares = (action) => {
  return Share.fetchList({ username: action.payload })
}

function* fetchUserSharesSaga(action) {
  try {
    const radiksShares = yield call(fetchUserShares, action)

    const shares = _.map(radiksShares, (share) => {
      return share.attrs
    })

    yield put({ type: FETCH_USER_SHARES_SUCCESS, payload: shares })
  } catch (error) {
    yield put({ type: FETCH_USER_SHARES_FAIL })
  }
}

export default fetchUserSharesSaga
