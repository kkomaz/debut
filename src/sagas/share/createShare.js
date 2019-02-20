import { put, call } from 'redux-saga/effects'
import { CREATE_SHARE_SUCCESS, CREATE_SHARE_FAIL } from 'actions'
import Share from 'model/share'

const createShare = (action) => {
  const { params } = action
  const share = new Share(params)
  share.save()

  // attrs does not contain id so making a new object this way
  return { ...share.attrs, _id: share._id }
}

function* createShareSaga(action) {
  try {
    const share = yield call(createShare, action)
    yield put({ type: CREATE_SHARE_SUCCESS, payload: share })
  } catch (error) {
    yield put({ type: CREATE_SHARE_FAIL, payload: error.message })
  }
}

export default createShareSaga
