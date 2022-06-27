import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import TextWrap from '../../../components/text-wrap/TextWrap';
import Topbar from '../../../components/topbar/Topbar';
import SearchBar from '../../../components/search-bar/SearchBar';
import TopTabs from './TopTabs';
import images from '../../../libs/images';
import colors from '../../../libs/colors';
import { navigate } from '../../../services/navigation';
import routes from '../../../libs/routes';
import Footer from '../../../libs/footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
} from '../../../services/util';
import {
  dialogOpenSelect,
  dialogOpenMessage,
} from '../../../redux/dialog/DialogActions';
import messaging from '@react-native-firebase/messaging';
import { requestPost, requestFile } from '../../../services/network';
import consts from '../../../libs/consts';
import { setSession, browsingTime } from '../../../redux/session/SessionAction';
import { useIsFocused } from '@react-navigation/native';

export default function HomeMain({ route, navigation }) {
  const [keyword, setKeyword] = useState('');
  const [sessionTime, setSessionTime] = useState('000000');

  const dispatch = useDispatch();
  const inputRef = useRef();
  const user = useSelector(s => s.user, shallowEqual);
  const session = useSelector(s => s.session, shallowEqual);

  const isFocused = useIsFocused();

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

    console.log('date_state ::', date_state);



  };


  const getData = async () => {
    try {

      let fcmtoken = await AsyncStorage.getItem('fcmtoken');
      saveTokenToDatabase(fcmtoken);
      if (fcmtoken) {
        saveTokenToDatabaseKcee(fcmtoken); //토핑어플의 DB에 저장하는 로직
      }
      if (fcmtoken !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  }

  //fireStore에 토큰저장하는 로직
  const saveTokenToDatabase = async (token) => {
    // Assume user is already signed in
    const userId = user.member_id;
    // Add the token to the users datastore
    await firestore()
      .collection('users')
      .doc(userId)
      .set({
        tokens: firestore.FieldValue.arrayUnion(token),
      });
  }
  //토핑어플의 DB에 저장하는 로직 추가
  const saveTokenToDatabaseKcee = async (token) => {
    const formData = new FormData();
    formData.append('memberId', user.member_id);
    formData.append('token', token);
    try {
      const { data, status } = await requestFile(
        { url: consts.apiUrl + '/admin/push/insertToken', method: 'post' },
        formData,
      );

    } catch (error) {
      console.log(error);
    }
  };
  //토핑어플의 DB에 저장하는 로직 끝

  let timer;

  useEffect(() => {
    if (isFocused) {
      timer = setInterval(() => {
        timeCount()

      }, 1000);
    }

    const unsubscribe = navigation.addListener('beforeRemove', () => {
      console.log('11')
      clearInterval(timer);
      setSessionTime('000000');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {

    if (user.agree_notice === 1) {
      messaging()
        .subscribeToTopic('toapingNotice')
        .then(() => { });
    } else if (user.agree_notice === 0) {
      messaging()
        .unsubscribeFromTopic('toapingNotice')
        .then(() => { });
    }

    if (user.agree_app_push === 1) {
      messaging()
        .subscribeToTopic('toapingAppPush')
        .then(() => { });
    } else if (user.agree_app_push === 0) {
      messaging()
        .unsubscribeFromTopic('toapingAppPush')
        .then(() => { });
    }

    if (user.agree_event === 1) {
      messaging()
        .subscribeToTopic('toapingEvent')
        .then(() => { });
    } else if (user.agree_event === 0) {
      messaging()
        .unsubscribeFromTopic('toapingEvent')
        .then(() => { });
    }

    getData();


    return () => {
      setKeyword('');
    };
  }, []);

  useEffect(() => {

    dispatch(browsingTime('NEWMAIN', sessionTime));

    console.log('sessionTime zzz', sessionTime);
  }, [sessionTime]);

  useEffect(() => {
    console.log('session 이 바뀌었다', session);
  }, [session]);

  const handleSearch = () => {
    if (keyword?.replace(/ /g, '')?.length < 1) {
      dispatch(dialogOpenMessage({ message: '한글자 이상 입력해주세요. \n*공백은 제거됩니다.' }));
    } else {
      setKeyword('');
      navigation.navigate(routes.searchBook, { keyword: keyword });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Topbar
        title="TOAPING"
        navigation={navigation}
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
      />
      {<StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />}

      <SearchBar
        value={keyword}
        inputRef={inputRef}
        onChange={setKeyword}
        style={styles.searchBar}
        placeholder="책제목, 저자, 출판사를 입력해주세요. "
        optionComponent={
          keyword ? (
            <TouchableOpacity
              onPress={() => {
                setKeyword('');
                inputRef.current?.focus();
              }}>
              <Image style={styles.x} source={images.delete} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                inputRef.current?.focus();
              }}>
              <Image style={styles.cameraIcon} source={images.search} />
            </TouchableOpacity>
          )
        }
        onSearch={handleSearch}
      />
      <TopTabs
        grade={route.params?.params?.grade}
        type={route.params?.params?.type ? route.params?.params?.type : 'main'}
      />
      <Footer
        page={
          route.params?.params?.type !== 'main' &&
            route.params?.params?.type !== undefined
            ? route.params?.params?.type
            : 'home'
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 18,
    backgroundColor: '#ececec',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  x: {
    marginRight: 5,
    width: widthPercentage(18),
    height: heightPercentage(18),
    resizeMode: 'cover',
  },
});
