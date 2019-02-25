import { put, call } from 'redux-saga/effects'
import { DELETE_SHARE_SUCCESS, DELETE_SHARE_FAIL } from 'actions'
import Share from 'model/share'

const deleteShare = async (action) => {
  const share = action.payload

  const deletedShare = await Share.findById(share._id)
  deletedShare.update({
    text: '',
    imageFile: '',
    valid: false
  })
  return deletedShare.save()
}

function* deleteShareSaga(action) {
  try {
    const share = yield call(deleteShare, action)
    yield put({ type: DELETE_SHARE_SUCCESS, payload: share.attrs })
  } catch (error) {
    console.log(error.message)
    yield put({ type: DELETE_SHARE_FAIL, payload: error.message })
  }
}

export default deleteShareSaga
