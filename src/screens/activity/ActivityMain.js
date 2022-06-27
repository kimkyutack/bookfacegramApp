import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import images from '../../libs/images';
import { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';
import MainQuiz from '../activity/MainQuiz';
import {setTab} from '../../redux/tab/TabAction';
import { useIsFocused } from '@react-navigation/native';
import { browsingTime } from '../../redux/session/SessionAction';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
  screenWidth,
  screenHeight,
} from '../../services/util';

export default function ActivityMain({route}) {
  const dispatch = useDispatch();
  const [sessionTime, setSessionTime] = useState('000000');
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
  };

//page 로그 찍는 로직
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('ACTIVITY', sessionTime));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);


  return (
    <View style={styles.mainroot}>
      <View style={styles.textroot}>
        <TextWrap style={styles.font}>다양한 독후활동에 참여해보세요!</TextWrap>
      </View>
      <View style={styles.root}>
        <View style={styles.root2}>
          <View style={styles.box2}>
            <TouchableOpacity
              onPress={() => {
                navigate(routes.home, {
                  screen: routes.topActivity,
                  params: {
                    type: 'examtest',
                    key: Date.now(),
                  },
                });
              }}>
              <View style={styles.box3}>
                <View style={styles.font4}>
                  <Image style={styles.img1} source={images.exam} />

                  <TextWrap style={styles.text_font}>문해고사</TextWrap>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.box2}>
            <TouchableOpacity
              onPress={() => {
                navigate(routes.home, {
                  screen: routes.topActivity,
                  params: {
                    type: 'kbstest',
                    key: Date.now(),
                  },
                });
              }}>
              <View style={styles.box3}>
                <View style={styles.font4}>
                  <Image style={styles.img2} source={images.kbs_exam} />

                  <TextWrap style={styles.text_font}>책과함께</TextWrap>
                  <TextWrap style={styles.text_font}>
                    KBS한국어능력시험
                  </TextWrap>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.root2}>
          <View style={styles.box2}>
            <TouchableOpacity
              onPress={() => {
                navigate(routes.home, {
                  screen: routes.topActivity,
                  params: {
                    type: 'contest',
                    key: Date.now(),
                  },
                });
              }}>
              <View style={styles.box3}>
                <View style={styles.font4}>
                  <Image style={styles.img2} source={images.competition} />

                  <TextWrap style={styles.text_font}>독후감대회</TextWrap>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.box2}>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  setTab({
                    tab: 'quiz',
                    rank: 'all',
                  }),
                );
                navigate(routes.activity, {
                  type: 'quiz',
                  rank: 'all',
                });
              }}>
              <View style={styles.box3}>
                <View style={styles.font4}>
                  <Image style={styles.img1} source={images.quiz} />

                  <TextWrap style={styles.text_font}>독서퀴즈</TextWrap>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    top: 10,
    flex: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  textroot: {
    top: 10,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainroot: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  root2: {
    width: screenWidth * 0.9,
    flexDirection: 'row',
  },
  font: {
    left: widthPercentage(20),
    top: heightPercentage(15),
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
  font2: {
    left: widthPercentage(16),
    top: heightPercentage(100),
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
  font3: {
    left: widthPercentage(24),
    top: heightPercentage(100),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font4: {
    flex: 1,
  },
  text_font: {
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
    alignSelf: 'center',
    bottom: screenHeight / 30,
  },
  font5: {
    right: widthPercentage(58),
    top: heightPercentage(90),
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
  font6: {
    left: widthPercentage(18),
    top: heightPercentage(90),
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
  img1: {
    resizeMode: 'contain',
    width: screenWidth / 14,
    flex: 1,
    alignSelf: 'center',
    bottom: screenHeight / 50,
  },
  img2: {
    resizeMode: 'contain',
    width: screenWidth / 10,
    flex: 1,
    alignSelf: 'center',

    bottom: screenHeight / 50,
  },
  box2: {
    margin: 5,
    borderColor: '#c9c9c9',
    borderWidth: 0.5,
    borderRadius: 20,
    height: heightPercentage(160),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    fontWeight: 'bold',
  },
  box3: {
    margin: 5,
    flex: 1,
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
