import { combineReducers } from 'redux';
import userReducer from './userReducer'
import blockstackReducer from './blockstackReducer'
import shareReducer from './shareReducer'
import followReducer from './followReducer'
import feedReducer from './feedReducer'
import recentReducer from './recentReducer'
import viewReducer from './viewReducer'
import taskReducer from './taskReducer'

const rootReducer = combineReducers({
  blockstack: blockstackReducer,
  feed: feedReducer,
  follow: followReducer,
  recent: recentReducer,
  share: shareReducer,
  task: taskReducer,
  user: userReducer,
  view: viewReducer,
});

export default rootReducer;
