import { combineReducers } from 'redux';
import userReducer from './userReducer'
import blockstackReducer from './blockstackReducer'

const rootReducer = combineReducers({
  user: userReducer,
  blockstack: blockstackReducer
});

export default rootReducer;
