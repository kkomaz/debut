import { ADD_DAPPS_TO_LIST } from 'actions'

const addDappsToList = (dapps) => {
  return { type: ADD_DAPPS_TO_LIST, payload: dapps }
};

export default addDappsToList
