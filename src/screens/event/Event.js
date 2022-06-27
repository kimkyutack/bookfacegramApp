import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import consts from '../../libs/consts';
import { requestGet } from '../../services/network';
import EventItem from './EventItem';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  screenWidth,
} from '../../services/util';
import { dialogOpenSelect } from '../../redux/dialog/DialogActions';
import { navigate } from '../../services/navigation';
import { browsingTime } from '../../redux/session/SessionAction';
import { useIsFocused } from '@react-navigation/native';

export default function Event({ navigation }) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const listRef = useRef();
  const [sessionTime, setSessionTime] = useState('000000');
  const isFocused = useIsFocused();
  const user = useSelector(s => s.user, shallowEqual);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requestGet({ url: consts.apiUrl + '/mypage/eventList' })
        .then(x => {
          setData([...x.data?.event]);
        })
        .catch(e => {
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

  //page 로그 찍는 로직
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('이벤트', sessionTime, user.member_id));
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
        title: '이벤트',
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
      {/* <View
        style={{
          borderBottomColor: colors.borderLine,
          borderBottomWidth: 1,
        }}
      /> */}
      {data.length === 0 ? (
        <View style={styles.root}>
          <Text style={{ marginTop: 10 }}>현재 진행중인 이벤트가 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          disableVirtualization={false}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item, index }) => {
            return <EventItem item={item} navigation={navigation} />;
          }}
          onScroll={event => {
            setContentVerticalOffset(event.nativeEvent.contentOffset.y);
          }}
        />

      )}
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listRef.current.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
      )}

      <Footer page="event" />
    </RootLayout >
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
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
