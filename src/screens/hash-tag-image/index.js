import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
} from '../../services/util';
import { navigationRef } from '../../services/navigation';
import { requestPost } from '../../services/network';

import Avatar from '../../components/avatar/Avatar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import {
  dialogError,
  dialogOpenSelect,
  dialogOpenAction,
} from '../../redux/dialog/DialogActions';
import FeedTopTabs from './FeedTopTabs';
import { useIsFocused } from '@react-navigation/native';
import { browsingTime } from '../../redux/session/SessionAction';

export default function HashTagImage({ route, navigation }) {
  const user = useSelector(s => s.user, shallowEqual);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [sessionTime, setSessionTime] = useState('000000');

  const { currentHashTag } = useSelector(s => s.tag);

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

        dispatch(browsingTime('피드북(검색페이지)', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.safeView}>
      <Topbar
        title={
          currentHashTag
            ? currentHashTag?.length > 10
              ? '#' + currentHashTag?.substring(0, 10) + '...'
              : '#' + currentHashTag
            : route.params?.params?.hashTag
              ? route.params?.params?.hashTag?.length > 10
                ? '#' + route.params?.params?.hashTag?.substring(0, 10) + '...'
                : '#' + route.params?.params?.hashTag
              : '해시태그'
        }
        navigation={navigation}
        back={true}
        options={{
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        }}
        optionsSearch={{
          component: (
            <Image style={styles.cameraIcon} source={images.feedCamera} />
          ),
          name: 'search',
          onPress: () =>
            navigation.navigate(routes.search, {
              timeKey: Date.now(),
            }),
        }}
        optionsAvator={{
          component: (
            <Avatar
              size={29}
              style={styles.avator}
              path={
                user?.profile_path
                  ? user?.profile_path
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
              }
            />
          ),
          name: 'avator',
          onPress: () => {
            navigation.navigate(routes.feedBookImage, {
              screen: routes.feedBookUserImage,
              params: {
                memberId: user.member_id,
                memberIdx: user.member_idx,
                profile_path: user?.profile_path
                  ? user?.profile_path
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png',
                key: Date.now(),
              },
            });
          },
        }}
      />
      <View style={styles.root}>
        <FeedTopTabs route={route} />
      </View>
      <Footer page="feed" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  root: {
    flex: 1,
  },
  infoContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    marginTop: 10,
  },

  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  status: {
    position: 'absolute',
    bottom: 0,
    left: widthPercentage(60),
    width: widthPercentage(42),
    height: heightPercentage(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006fff',
  },
  statusOutline: {
    position: 'absolute',
    bottom: 0,
    left: widthPercentage(60),
    width: widthPercentage(42),
    height: heightPercentage(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    color: colors.white,
    fontSize: fontPercentage(10),
    lineHeight: fontPercentage(19),
  },
});
