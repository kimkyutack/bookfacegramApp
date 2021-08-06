import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import dialog from './dialog/DialogReducer';
import user from './user/UserReducer';
import socket from './socket/SocketReducer';
import loading from './loading/LoadingReducer';
import keyboard from './keyboard/KeyboardReducer';
import chat from './chat/ChatReducer';
import tab from './tab/TabReducer';

const appReducer = combineReducers({
  user: user,
  tab: tab,
  loading: loading,
  chat: chat,
  socket: socket,
  keyboard: keyboard,
  dialog: dialog,
});

const rootReducer = (state, action) => {
  if (action.type === 'clear') {
    state = {};
  }
  return appReducer(state, action);
};
export default createStore(rootReducer, {}, applyMiddleware(thunk));
