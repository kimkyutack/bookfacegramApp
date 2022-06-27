import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import dialog from './dialog/DialogReducer';
import user from './user/UserReducer';
import keyboard from './keyboard/KeyboardReducer';
import tab from './tab/TabReducer';
import book from './book/BookReducer';
import tag from './tag/TagReducer';
import session from './session/SessionReducer';

const appReducer = combineReducers({
  user: user,
  tab: tab,
  book: book,
  tag: tag,
  keyboard: keyboard,
  dialog: dialog,
  session: session,
});

const rootReducer = (state, action) => {
  if (action.type === 'clear') {
    state = {};
  }
  return appReducer(state, action);
};
export default createStore(rootReducer, {}, applyMiddleware(thunk));
