import { put, call } from 'redux-saga/effects'
import { EDIT_SHARE_SUCCESS, EDIT_SHARE_FAIL } from 'actions'
import Share from 'model/share'

const editShare = async (action) => {
  const { params, id } = action
  const share = await Share.findById(id)
  share.update(params)
  return share.save()
}

function* editShareSaga(action) {
  try {
    const share = yield call(editShare, action)
    yield put({ type: EDIT_SHARE_SUCCESS, payload: share.attrs })
  } catch (error) {
    yield put({ type: EDIT_SHARE_FAIL })
  }
}

export default editShareSaga
