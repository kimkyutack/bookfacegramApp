import React, {useEffect} from 'react';
import Router from './Route';
import {Provider, useDispatch, useSelector, shallowEqual} from 'react-redux';
import store from './redux/store';
import {Keyboard, StatusBar} from 'react-native';
import {keyboardActionType} from './redux/keyboard/KeyboardActions';
import DialogMessage from './redux-components/dialog-message/DialogMessage';
import DialogAction from './redux-components/dialog-action/DialogAction';

function App({}) {
  const dispatch = useDispatch();
  // const {connected} = useSelector(s => s.socket, []);

  useEffect(() => {
    const hideListenr = () => {
      dispatch({type: keyboardActionType.hide});
    };
    const showListenr = () => {
      dispatch({type: keyboardActionType.show});
    };

    Keyboard.addListener('keyboardDidHide', hideListenr);
    Keyboard.addListener('keyboardDidShow', showListenr);

    return () => {
      // PushNotification.deleteChannel(consts.androidPushChannel);
      Keyboard.removeListener('keyboardWillHide', hideListenr);
      Keyboard.removeListener('keyboardWillShow', showListenr);
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Router />
      <DialogMessage />
      <DialogAction />
    </>
  );
}

export default function ProviderApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
