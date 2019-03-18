import { combineReducers } from 'redux';
import userReducer from './userReducer'
import blockstackReducer from './blockstackReducer'
import shareReducer from './shareReducer'
import followReducer from './followReducer'
import feedReducer from './feedReducer'

const rootReducer = combineReducers({
  blockstack: blockstackReducer,
  feed: feedReducer,
  follow: followReducer,
  share: shareReducer,
  user: userReducer,
});

export default rootReducer;
