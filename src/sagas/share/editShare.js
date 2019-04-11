import { put, call } from 'redux-saga/effects'
import { EDIT_SHARE_SUCCESS, EDIT_SHARE_FAIL } from 'actions'
import Share from 'model/share'
import checkMentions from 'utils/mentions/checkMentions'
import Mention from 'model/mention'

const editShare = async (action) => {
  const { params, id } = action
  // let mentions = []
  const share = await Share.findById(id)
  share.update(params)

  // const mention = [...new Set(checkMentions(params.text))]
  // const filteredMentions = _.filter(mention, (m) => m.substring(1).trim() !== username)
  //
  // const mentionsList = Mention.fetchList({ parent_id: id })
  //
  // for (let i = 0; i < mentionsList.length; i++) {
  //
  // }
  return share.save()
}

function* editShareSaga(action) {
  try {
    const share = yield call(editShare, action)
    yield put({ type: EDIT_SHARE_SUCCESS, payload: share.attrs })
  } catch (error) {
    yield put({ type: EDIT_SHARE_FAIL, payload: error.message })
  }
}

export default editShareSaga
