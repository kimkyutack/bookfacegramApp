import React, { useEffect, useState } from 'react';
import Router from './Route';
import { Provider, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Text, StyleSheet, View, Button } from 'react-native';
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
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission, NotificationLister } from './components/FCMContainer/pushnotification_helper';
import { dialogError } from './redux/dialog/DialogActions';
import BackgroundControls from './components/audio-player/BackgroundPlayer';


function App({ }) {
  const dispatch = useDispatch();
  const showaudio = useSelector(state => state.showaudio);
  useEffect(() => {
    LogBox.ignoreLogs(['Sending']);
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      dispatch(dialogError(remoteMessage.notification.body));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();
    //NotificationLister();
  }, []);


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

  useEffect(() => {
    console.log(showaudio.playstart)
  }, [showaudio])

  return (
    <>
      <StatusBar barStyle='light-content' />
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
      {showaudio.playstart === 1 ? <BackgroundControls currentTime={0} track={showaudio.track} backRate={2}/> : null}
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