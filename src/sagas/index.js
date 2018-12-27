import { takeEvery } from 'redux-saga/effects'
import fetchAllUsersSaga from './user/fetchAllUsers'

export default function* rootSaga() {
  yield takeEvery('REQUEST_ALL_USERS', fetchAllUsersSaga)
}
