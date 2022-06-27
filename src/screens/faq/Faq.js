import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import { dialogOpenSelect } from '../../redux/dialog/DialogActions';
import { requestGet } from '../../services/network';
import FaqItem from './FaqItem';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
  screenWidth,
} from '../../services/util';
import { navigate } from '../../services/navigation';
import { browsingTime } from '../../redux/session/SessionAction';

export default function Faq({ route, navigation }) {
  const [data, setData] = useState([]);
  const [color1, setColor1] = useState('#c9c9c9');
  const [color2, setColor2] = useState('#FED500');
  const [color3, setColor3] = useState('#c9c9c9');
  const [color4, setColor4] = useState('#c9c9c9');
  const [sessionTime, setSessionTime] = useState('000000');
  const [category_, setCategory] = useState('feed');
  const listRef = useRef();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 50;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector(s => s.user, shallowEqual);
  const changeStyle = type => {
    if (type === 'service') {
      setColor1('#FED500');
      setColor2('#c9c9c9');
      setColor3('#c9c9c9');
      setColor4('#c9c9c9');
    } else if (type === 'feed') {
      setColor1('#c9c9c9');
      setColor2('#FED500');
      setColor3('#c9c9c9');
      setColor4('#c9c9c9');
    } else if (type === 'read') {
      setColor1('#c9c9c9');
      setColor2('#c9c9c9');
      setColor3('#FED500');
      setColor4('#c9c9c9');
    } else {
      setColor1('#c9c9c9');
      setColor2('#c9c9c9');
      setColor3('#c9c9c9');
      setColor4('#FED500');
    }
    setCategory(type);
  };

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

        dispatch(browsingTime('FAQ', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);
  useEffect(() => {
    requestGet({ url: consts.apiUrl + '/mypage/help' })
      .then(x => {
        setData([...x.data]);
      })
      .catch(e => {
        // console.log(e);
        // dispatch(dialogError(e));
      });
  }, []);


  useEffect(() => {
    //console.log(JSON.stringify(user));
    const unsubscribe = navigation.addListener('focus', () => {
      setCategory('feed');
      setColor1('#c9c9c9');
      setColor2('#FED500');
      setColor3('#c9c9c9');
      setColor4('#c9c9c9');
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <RootLayout
      topbar={{
        title: '도움말(FAQ)',
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
      <View style={styles.menu}>
        <View>
          <TouchableOpacity onPress={() => changeStyle('feed')}>
            {color2 === '#c9c9c9' ? (
              <TextWrap
                style={{
                  borderBottomColor: color2,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',
                  borderBottomWidth: 0,
                }}>
                피드북
              </TextWrap>
            ) : (
              <View style={{
                borderBottomColor: color2,
                borderBottomWidth: 4,
              }}>
                <TextWrap
                  style={{
                    width: screenWidth / 4,
                    height: heightPercentage(40),
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    fontSize: fontPercentage(13),
                    textAlign: 'center',
                  }}>
                  피드북
                </TextWrap>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => changeStyle('service')}>
            {color1 === '#c9c9c9' ? (
              <TextWrap
                style={{
                  borderBottomColor: color1,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',
                  borderBottomWidth: 0,
                }}>
                서비스
              </TextWrap>
            ) : (
              <View style={{
                borderBottomColor: color1,
                borderBottomWidth: 4,
              }}>
                <TextWrap
                  style={{
                    width: screenWidth / 4,
                    height: heightPercentage(40),
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    fontSize: fontPercentage(13),
                    textAlign: 'center',
                  }}>
                  서비스
                </TextWrap>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => changeStyle('read')}>
            {color3 === '#c9c9c9' ? (
              <TextWrap
                style={{
                  borderBottomColor: color3,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',

                  textAlign: 'center',
                  fontSize: fontPercentage(13),
                  borderBottomWidth: 0,
                }}>
                독후활동
              </TextWrap>
            ) : (
              <View style={{
                borderBottomColor: color3,
                borderBottomWidth: 4,
              }}>
                <TextWrap
                  style={{
                    width: screenWidth / 4,
                    height: heightPercentage(40),
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    textAlign: 'center',
                    fontSize: fontPercentage(13),
                  }}>
                  독후활동
                </TextWrap>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => changeStyle('mem')}>
            {color4 === '#c9c9c9' ? (
              <TextWrap
                style={{
                  borderBottomColor: color4,
                  width: screenWidth / 4,
                  height: heightPercentage(40),
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  fontSize: fontPercentage(13),
                  textAlign: 'center',
                  borderBottomWidth: 0,
                }}>
                회원
              </TextWrap>
            ) : (
              <View style={{
                borderBottomColor: color4,
                borderBottomWidth: 4,
              }}>
                <TextWrap
                  style={{
                    width: screenWidth / 4,
                    height: heightPercentage(40),
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    fontSize: fontPercentage(13),
                    textAlign: 'center',
                  }}>
                  회원
                </TextWrap>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: colors.borderLine,
        }}
      />
      <FlatList
        data={data}
        ref={listRef}
        onScroll={event => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
        keyExtractor={(item, index) => {
          return item.question + index.toString();
        }}
        renderItem={({ item, index }) => {
          return (
            <FaqItem {...item} categoryType={category_} isFocused={isFocused} />
          );
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

      <Footer page="faq" />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  menu: {
    resizeMode: 'cover',
    flexDirection: 'row',
    width: screenWidth,
    height: heightPercentage(42),
  },
  tapmenu: {
    width: '100%',
    height: heightPercentage(40),
    alignItems: 'center',
    alignSelf: 'stretch',
    fontSize: 20,
    paddingHorizontal: '8.5%',
  },
  selectmenu: {
    width: '100%',
    height: heightPercentage(40),
    alignItems: 'center',
    alignSelf: 'stretch',
    fontSize: 20,
    paddingHorizontal: '8.5%',
    borderBottomWidth: 4,
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
