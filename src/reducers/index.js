import { combineReducers } from 'redux';
import userReducer from './userReducer'
import blockstackReducer from './blockstackReducer'
import shareReducer from './shareReducer'

const rootReducer = combineReducers({
  user: userReducer,
  blockstack: blockstackReducer,
  share: shareReducer,
});

export default rootReducer;
