import { put, call } from 'redux-saga/effects'
import axios from 'axios'
import { DELETE_SHARE_SUCCESS, DELETE_SHARE_FAIL } from 'actions'
import Share from 'model/share'
import Mention from 'model/mention'

const deleteShare = async (action) => {
  const share = action.payload

  const deletedShare = await Share.findById(share._id)
  deletedShare.update({
    text: '',
    imageFile: '',
    valid: false
  })

  axios.put(`/comment/?share_id=${share._id}`)

  const mentions = await Mention.fetchList({ parent_id: share._id })

  if (mentions.length > 0) {
    for (let i = 0; i < mentions.length; i++) {
      const currentMention = await Mention.findById(mentions[i].id)
      await currentMention.destroy()
    }
  }

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
