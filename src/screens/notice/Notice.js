import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import { dialogOpenSelect } from '../../redux/dialog/DialogActions';
import { requestGet } from '../../services/network';
import NoticeItem from './NoticeItem';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  screenWidth,
} from '../../services/util';
import { navigate } from '../../services/navigation';
import { browsingTime } from '../../redux/session/SessionAction';

export default function Notice({ route, navigation }) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const [sessionTime, setSessionTime] = useState('000000');
  const user = useSelector(s => s.user, shallowEqual);

  const CONTENT_OFFSET_THRESHOLD = 300;
  const listRef = useRef();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requestGet({ url: consts.apiUrl + '/mypage/noticeList' })
        .then(x => {
          setData([...x.data?.noticeList]);
        })
        .catch(e => {
          // console.log(e);
          // dispatch(dialogError(e));
        });
    });

    return unsubscribe;
  }, [navigate]);

  let hour = 0, minute = 0, second = -1;


  function timeCount() {


    let dsp_hour, dsp_minute, dsp_second;

    second++;

    if (minute == 60) {
      hour++;
      minute = 0;
    }
    if (second == 60) {
      minute++;
      second = 0;
    }

    if (hour < 10)
      dsp_hour = '0' + hour;
    else
      dsp_hour = hour;

    if (minute < 10)
      dsp_minute = '0' + minute;
    else
      dsp_minute = minute;

    if (second < 10)
      dsp_second = '0' + second;
    else
      dsp_second = second;


    let date_state = dsp_hour + dsp_minute + dsp_second;


    setSessionTime(date_state);
  };

  //page ?????? ?????? ??????
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('????????????', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);

  return (
    <RootLayout
      topbar={{
        title: '????????????',
        navigation: navigation,
        back: true,
        options: {
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        },
      }}>
      <View
        style={{
          borderBottomColor: colors.borderLine,
          borderBottomWidth: 1,
        }}
      />
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item, index) => {
          return item.title + index.toString();
        }}
        renderItem={({ item, index }) => {
          return <NoticeItem {...item} isFocused={isFocused} bannerYn={route?.params ? route.params.idx : 0} />;
        }}
        onScroll={event => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
      />
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listRef.current.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
      )}
      <Footer page="notice" />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: heightPercentage(65),
    left: screenWidth / 2.2,
    display: 'flex',
  },
});
