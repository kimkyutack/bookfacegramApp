import React, {useEffect, useState} from 'react';
import Router from './Route';
import {Provider, useDispatch, useSelector, shallowEqual} from 'react-redux';
import store from './redux/store';
import {Keyboard, StatusBar, Dimensions, LogBox} from 'react-native';
import {keyboardActionType} from './redux/keyboard/KeyboardActions';
import DialogMessage from './redux-components/dialog-message/DialogMessage';
import DialogGrade from './redux-components/dialog-grade/DialogGrade';
import DialogAction from './redux-components/dialog-action/DialogAction';
import DialogSelect from './redux-components/dialog-select/DialogSelect';
import DialogKakaoLogin from './redux-components/dialog-kakao-login-select/DialogKakaoLogin';
import DialogDrawer from './redux-components/dialog-drawer/DialogDrawer';
import DialogDrawerKeyBoard from './redux-components/dialog-drawer-keyboard/DialogDrawerKeyBoard';
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
    LogBox.ignoreLogs(['EventEmitter.removeListener']);

    return () => {
      Keyboard.remove('keyboardWillHide', hideListenr);
      Keyboard.remove('keyboardWillShow', showListenr);
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Router />
      <DialogMessage />
      <DialogGrade />
      <DialogAction />
      <DialogSelect />
      <DialogKakaoLogin />
      <DialogDrawer />
      <DialogDrawerKeyBoard />
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
