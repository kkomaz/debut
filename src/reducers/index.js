import { combineReducers } from 'redux';
import userReducer from './userReducer'
import blockstackReducer from './blockstackReducer'
import shareReducer from './shareReducer'
import followReducer from './followReducer'

const rootReducer = combineReducers({
  blockstack: blockstackReducer,
  follow: followReducer,
  share: shareReducer,
  user: userReducer,
});

export default rootReducer;
