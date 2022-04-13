import React, {useEffect, useState} from 'react';
import {FlatList, View, Image, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import TextWrap from '../../components/text-wrap/TextWrap';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {dialogOpenSelect, dialogError} from '../../redux/dialog/DialogActions';
import {requestGet, requestPut} from '../../services/network';
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
} from '../../services/util';

export default function Setting({route, navigation}) {
  const [notice, setNotice] = useState();
  const [push, setPush] = useState();
  const [event, setEvent] = useState();
  const [noticecheck, setNoticecheck] = useState();
  const [pushcheck, setPushcheck] = useState();
  const [eventcheck, setEventcheck] = useState();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // useEffect(() => {
  //   requestGet({url: consts.apiUrl + '/mypage/setting'})
  //     .then(x => {
  //       setNotice(x.data.agreeNotice);
  //       setPush(x.data.agreeAppPush);
  //       setEvent(x.data.agreeEvent);
  //     })
  //     .catch(e => {
  //       // console.log(e);
  //       // dispatch(dialogError(e));
  //     });
  // });

  useEffect(() => {
    requestGet({url: consts.apiUrl + '/mypage/setting'})
      .then(x => {
        setNotice(x.data.agreeNotice);
        setPush(x.data.agreeAppPush);
        setEvent(x.data.agreeEvent);

        if (x.data.agreeNotice === 0) {
          setNoticecheck(false);
        } else {
          setNoticecheck(true);
        }

        if (x.data.agreeEvent === 0) {
          setEventcheck(false);
        } else {
          setEventcheck(true);
        }
        if (x.data.agreeAppPush === 0) {
          setPushcheck(false);
        } else {
          setPushcheck(true);
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
          setNoticecheck(!noticecheck);
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
          setEventcheck(!eventcheck);
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
          setPushcheck(!pushcheck);
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
        <View>
          <CheckBox
            value={noticecheck}
            onValueChange={() => noticeChange(notice)}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.main}>
        <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
          토핑 이벤트 알림
        </TextWrap>
        <View>
          <CheckBox
            value={eventcheck}
            onValueChange={() => eventChange(event)}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.main}>
        <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
          광고 PUSH 알림
        </TextWrap>
        <View style={styles.flexView}>
          <CheckBox value={pushcheck} onValueChange={() => appChange(push)} />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.emptyHeight} />
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
    fontSize: fontPercentage(16),
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
  emptyHeight: {
    height: heightPercentage(265),
  },
});
