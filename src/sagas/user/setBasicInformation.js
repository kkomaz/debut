import { put, call } from 'redux-saga/effects'
import {
  SET_BASIC_INFO_SUCCESS,
  SET_BASIC_INFO_FAIL,
} from 'actions'
import BasicInformation from 'model/basicInformation'

const setBasicInformation = async (action) => {
  const { id, params } = action.payload

  // Edit, id included in attrs
  if (id) {
    const basicInformation = await BasicInformation.findById(id)
    basicInformation.update(params)
    basicInformation.save()
    return basicInformation.attrs
  }


  // Save, id - id NOT included in attrs
  const basicInformation = new BasicInformation(params)
  basicInformation.save()
  return {
    ...basicInformation.attrs,
    _id: basicInformation._id,
  }
}

function* setBasicInformationSaga(action) {
  try {
    const basicInformation = yield call(setBasicInformation, action)
    yield put({ type: SET_BASIC_INFO_SUCCESS, payload: {
      basicInformation,
      username: action.payload.username,
    }})
  } catch (error) {
    yield put({ type: SET_BASIC_INFO_FAIL })
  }
}


export default setBasicInformationSaga
