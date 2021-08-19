import React, {useEffect, useState} from 'react';
import Router from './Route';
import {Provider, useDispatch, useSelector, shallowEqual} from 'react-redux';
import store from './redux/store';
import {Keyboard, StatusBar, Dimensions} from 'react-native';
import {keyboardActionType} from './redux/keyboard/KeyboardActions';
import DialogMessage from './redux-components/dialog-message/DialogMessage';
import DialogAction from './redux-components/dialog-action/DialogAction';
import DialogSelect from './redux-components/dialog-select/DialogSelect';
console.reportErrorsAsExceptions = false;
function App({}) {
  const dispatch = useDispatch();

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
      <DialogSelect />
    </>
  );
}
console.reportErrorsAsExceptions = false;
export default function ProviderApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
