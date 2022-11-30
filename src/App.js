import React, { useEffect, useState } from 'react';
import Router from './Route';
import { Provider, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Text, StyleSheet, View, Button } from 'react-native';
import store from './redux/store';
import { Keyboard, StatusBar, Dimensions, LogBox, Alert } from 'react-native';
import { keyboardActionType } from './redux/keyboard/KeyboardActions';
import DialogMessage from './redux-components/dialog-message/DialogMessage';
import DialogGrade from './redux-components/dialog-grade/DialogGrade';
import DialogCate from './redux-components/dialog-cate/DialogCate';
import DialogGradeProfile from './redux-components/dialog-grade-profile/DialogGradeProfile';
import DialogRegion from './redux-components/dialog-region/DialogRegion';
import DialogAction from './redux-components/dialog-action/DialogAction';
import DialogActionProfile from './redux-components/dialog-action/DialogActionProfile';
import DialogMore from './redux-components/dialog-select/DialogMore';
import DialogSelect from './redux-components/dialog-select/DialogSelect';
import DialogKakaoLogin from './redux-components/dialog-kakao-login-select/DialogKakaoLogin';
import DialogDrawer from './redux-components/dialog-drawer/DialogDrawer';
import DialogDrawerKeyBoard from './redux-components/dialog-drawer-keyboard/DialogDrawerKeyBoard';
import DialogDrawerKeyBoardPW from './redux-components/dialog-drawer-keyboardPW/DialogDrawerKeyboardPW';
import AudioPlayer from './screens/activity/audioplayer';
import DialogDrawerKeyBoardWD from './redux-components/dialog-drawer-keyboardWD/DialogDrawerKeyBoardWD';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission, NotificationLister } from './components/FCMContainer/pushnotification_helper';
import { dialogError } from './redux/dialog/DialogActions';
import BackgroundControls from './components/audio-player/BackgroundPlayer';
import { setShowMain } from './redux/audiobook/AudioAction';
import DialogGather from './redux-components/dialog-gather/DialogGather';
import DialogPayment from './redux-components/dialog-payment/DialogPayment';
import DialogDate from './redux-components/dialog-date/DialogDate';


function App({ }) {
  const dispatch = useDispatch();
  const showaudio = useSelector(state => state.showaudio);
  const user = useSelector(s => s.user, shallowEqual);
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

  return (
    <>
      <StatusBar barStyle='light-content' />
      <Router />
      <DialogMessage />
      <DialogPayment />
      <DialogGrade />
      <DialogRegion />
      <DialogGradeProfile />
      <DialogAction />
      <DialogSelect />
      <DialogMore />
      <DialogCate />
      <DialogKakaoLogin />
      <DialogDrawer />
      <DialogDate />
      <DialogGather />
      <DialogDrawerKeyBoard />
      <DialogDrawerKeyBoardPW />
      <DialogDrawerKeyBoardWD />
      <DialogActionProfile />
      {showaudio.playstart === 1 ? <BackgroundControls currentTime={showaudio.current} track={showaudio.track} backRate={2}/> : null}
      {showaudio.startmain === 1 ?
        <AudioPlayer
          track={showaudio.track}
          currentTime={showaudio.current} //현재 시간
          userId ={user.member_id}  //사용자 ID
          onClose={() => {
            dispatch(setShowMain(0,0));
          }}
        />
      : null}
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