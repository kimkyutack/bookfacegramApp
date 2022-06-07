import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View, Image, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import TextWrap from '../../components/text-wrap/TextWrap';
import { useIsFocused } from '@react-navigation/native';
import RootLayout from '../../layouts/root-layout/RootLayout';
import { dialogOpenSelect, dialogError } from '../../redux/dialog/DialogActions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { requestGet, requestPut } from '../../services/network';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  fontPercentage,
  formatTime,
  screenWidth,
  widthPercentage,
  heightPercentage,
  screenHeight,
} from '../../services/util';
import messaging from '@react-native-firebase/messaging';
import { userUpdate3 } from '../../redux/user/UserActions';

export default function Setting({ route, navigation }) {
  const user = useSelector(s => s.user, shallowEqual);
  const [notice, setNotice] = useState();
  const [push, setPush] = useState();
  const [event, setEvent] = useState();
  const [noticecheck, setNoticecheck] = useState();
  const [pushcheck, setPushcheck] = useState();
  const [eventcheck, setEventcheck] = useState();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const moveX1 = useRef(new Animated.Value(4)).current;
  const moveX2 = useRef(new Animated.Value(4)).current;
  const moveX3 = useRef(new Animated.Value(4)).current;

  const moveRight1 = () => {
    Animated.timing(moveX1, {
      toValue: 26,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const moveLeft1 = () => {
    Animated.timing(moveX1, {
      toValue: 4,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const moveRight2 = () => {
    Animated.timing(moveX2, {
      toValue: 26,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const moveLeft2 = () => {
    Animated.timing(moveX2, {
      toValue: 4,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const moveRight3 = () => {
    Animated.timing(moveX3, {
      toValue: 26,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const moveLeft3 = () => {
    Animated.timing(moveX3, {
      toValue: 4,
      duration: 300,
      useNativeDriver: false
    }).start();
  };


  useEffect(() => {
    if (user.agree_notice === 1) {
      messaging()
        .subscribeToTopic('toapingNotice')
        .then(() => console.log('Subscribed to toapingNotice!'));
    } else if (user.agree_notice === 0) {
      messaging()
        .unsubscribeFromTopic('toapingNotice')
        .then(() => console.log('Unsubscribed fom the toapingNotice!'));
    }

    if (user.agree_app_push === 1) {
      messaging()
        .subscribeToTopic('toapingAppPush')
        .then(() => console.log('Subscribed to toapingAppPush!'));
    } else if (user.agree_app_push === 0) {
      messaging()
        .unsubscribeFromTopic('toapingAppPush')
        .then(() => console.log('Unsubscribed fom the toapingAppPush!'));
    }

    if (user.agree_event === 1) {
      messaging()
        .subscribeToTopic('toapingEvent')
        .then(() => console.log('Subscribed to toapingEvent!'));
    } else if (user.agree_event === 0) {
      messaging()
        .unsubscribeFromTopic('toapingEvent')
        .then(() => console.log('Unsubscribed fom the toapingEvent!'));
    }
  }, [user]);

  // useEffect(() => {
  //   requestGet({url: consts.apiUrl + '/mypage/setting'})
  //     .then(x => {
  //       setNotice(x.data.agree_notice);
  //       setPush(x.data.agree_app_push);
  //       setEvent(x.data.agree_event);
  //     })
  //     .catch(e => {
  //       // console.log(e);
  //       // dispatch(dialogError(e));
  //     });
  // });
  useEffect(() => {
    requestGet({ url: consts.apiUrl + '/mypage/setting' })
      .then(x => {
        setNotice(x.data.agree_notice);
        setPush(x.data.agree_app_push);
        setEvent(x.data.agree_event);

        if (x.data.agree_notice === 0) {
          setNoticecheck(false);
          moveLeft1()
        } else {
          setNoticecheck(true);
          moveRight1()
        }

        if (x.data.agree_event === 0) {
          setEventcheck(false);
          moveLeft2()
        } else {
          setEventcheck(true);
          moveRight2()
        }
        if (x.data.agree_app_push === 0) {
          setPushcheck(false);
          moveLeft3()
        } else {
          setPushcheck(true);
          moveRight3()
        }
      })
      .catch(e => {
        // console.log(e);
        // dispatch(dialogError(e));
      });
  });

  const noticeChange = noticeValue => {
    requestPut({
      url: consts.apiUrl + '/mypage/setting',
      body: {
        agree: noticeValue === 0 ? 1 : 0,
        type: 'notice',
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          dispatch(userUpdate3);
          setNoticecheck(!noticecheck);
          if (noticecheck === true) {
            moveLeft1()
          } else {
            moveRight1()
          }


        } else {
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      });
  };

  const eventChange = eventValue => {
    requestPut({
      url: consts.apiUrl + '/mypage/setting',
      body: {
        agree: eventValue === 0 ? 1 : 0,
        type: 'event',
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          dispatch(userUpdate3);
          setEventcheck(!eventcheck);
          if (eventcheck === true) {
            moveLeft2()
          } else {
            moveRight2()
          }
        } else {
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      });
  };

  const appChange = app => {
    requestPut({
      url: consts.apiUrl + '/mypage/setting',
      body: {
        agree: app === 0 ? 1 : 0,
        type: 'appPush',
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          dispatch(userUpdate3);
          setPushcheck(!pushcheck);
          if (pushcheck === true) {
            moveLeft3()
          } else {
            moveRight3()
          }
        } else {
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      });
  };

  return (
    <RootLayout
      topbar={{
        title: '앱설정',
        navigation: navigation,
        back: true,
      }}>
      <View style={{ flex: 1 }}>
        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title2}>
            알림
          </TextWrap>
        </View>
        <View style={styles.divider} />
        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
            토핑 공지사항 알림
          </TextWrap>
          <TouchableWithoutFeedback
            onPress={() => noticeChange(notice)}>
            <View style={styles.flexView}>
              <View style={!noticecheck ? styles.switchOff : styles.switchOn}>
                <Animated.View
                  style={[
                    !noticecheck ? styles.switchSliderOff : styles.switchSliderOn,
                    {
                      left: moveX1
                    }
                  ]}
                ></Animated.View>
                {/* <View style={!noticecheck ? styles.switchSliderOff : styles.switchSliderOn}></View> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.divider} />
        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
            토핑 이벤트 알림
          </TextWrap>
          <TouchableWithoutFeedback
            onPress={() => eventChange(event)}>
            <View style={styles.flexView}>
              <View style={!eventcheck ? styles.switchOff : styles.switchOn}>
                <Animated.View
                  style={[
                    !eventcheck ? styles.switchSliderOff : styles.switchSliderOn,
                    {
                      left: moveX2
                    }
                  ]}
                ></Animated.View>
                {/* <View style={!eventcheck ? styles.switchSliderOff : styles.switchSliderOn}></View> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.divider} />
        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
            광고 PUSH 알림
          </TextWrap>
          <TouchableWithoutFeedback
            onPress={() => appChange(push)}>
            <View style={styles.flexView}>
              <View style={!pushcheck ? styles.switchOff : styles.switchOn}>
                <Animated.View
                  style={[
                    !pushcheck ? styles.switchSliderOff : styles.switchSliderOn,
                    {
                      left: moveX3
                    }
                  ]}
                ></Animated.View>
                {/* <View style={!pushcheck ? styles.switchSliderOff : styles.switchSliderOn}></View> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.divider} />

      </View>
      <Footer page="notice" />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderRadius: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  title: {
    color: colors.black,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(24),
    display: 'flex',
  },
  title2: {
    color: colors.black,
    fontSize: fontPercentage(18),
    lineHeight: fontPercentage(27),
    fontWeight: '700',
  },
  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
    display: 'flex',
    flexShrink: 1,
    justifyContent: 'space-between',
  },
  flexView: {
    display: 'flex',
  },
  switchOn: {
    width: 52,
    height: 30,
    position: 'relative',
    backgroundColor: '#FFAA2B',
    borderRadius: 30,
  },
  switchOff: {
    width: 52,
    height: 30,
    position: 'relative',
    backgroundColor: '#ccc',
    borderRadius: 30,
  },
  switchSliderOff: {
    width: 22,
    height: 22,
    position: 'absolute',
    bottom: 4,
    borderRadius: 300,
    backgroundColor: 'white',

  },
  switchSliderOn: {
    width: 22,
    height: 22,
    position: 'absolute',
    bottom: 4,
    borderRadius: 300,
    backgroundColor: 'white',
  }
});
