import React, { useEffect, useState } from 'react';
import Router from './Route';
import { Provider, useDispatch, useSelector, shallowEqual } from 'react-redux';
import store from './redux/store';
import { Keyboard, StatusBar, Dimensions, LogBox, Alert } from 'react-native';
import { keyboardActionType } from './redux/keyboard/KeyboardActions';
import DialogMessage from './redux-components/dialog-message/DialogMessage';
import DialogGrade from './redux-components/dialog-grade/DialogGrade';
import DialogGradeProfile from './redux-components/dialog-grade-profile/DialogGradeProfile';
import DialogAction from './redux-components/dialog-action/DialogAction';
import DialogActionProfile from './redux-components/dialog-action/DialogActionProfile';
import DialogMore from './redux-components/dialog-select/DialogMore';
import DialogSelect from './redux-components/dialog-select/DialogSelect';
import DialogKakaoLogin from './redux-components/dialog-kakao-login-select/DialogKakaoLogin';
import DialogDrawer from './redux-components/dialog-drawer/DialogDrawer';
import DialogDrawerKeyBoard from './redux-components/dialog-drawer-keyboard/DialogDrawerKeyBoard';
import DialogDrawerKeyBoardPW from './redux-components/dialog-drawer-keyboardPW/DialogDrawerKeyboardPW';
import DialogDrawerKeyBoardWD from './redux-components/dialog-drawer-keyboardWD/DialogDrawerKeyBoardWD';
// import messaging from '@react-native-firebase/messaging';

function App({ }) {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('123');
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const hideListenr = () => {
      dispatch({ type: keyboardActionType.hide });
    };
    const showListenr = () => {
      dispatch({ type: keyboardActionType.show });
    };

    Keyboard.addListener('keyboardDidHide', hideListenr);
    Keyboard.addListener('keyboardDidShow', showListenr);
    LogBox.ignoreLogs(['EventEmitter.removeListener']);

    return () => {
      Keyboard.addListener('keyboardWillHide', hideListenr).remove();
      Keyboard.addListener('keyboardWillShow', showListenr).remove();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Router />
      <DialogMessage />
      <DialogGrade />
      <DialogGradeProfile />
      <DialogAction />
      <DialogSelect />
      <DialogMore />
      <DialogKakaoLogin />
      <DialogDrawer />
      <DialogDrawerKeyBoard />
      <DialogDrawerKeyBoardPW />
      <DialogDrawerKeyBoardWD />
      <DialogActionProfile />
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
