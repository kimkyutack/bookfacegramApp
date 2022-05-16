import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  ScrollView,
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Button,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {navigate} from '../../services/navigation';

import colors from '../../libs/colors';
import SearchBar from '../../components/search-bar/SearchBar';
import Topbar from '../../components/topbar/Topbar';
import images from '../../libs/images';
import Radio from '../../components/radio/Radio';
import TextWrap from '../../components/text-wrap/TextWrap';
import {
  dialogOpenSelect,
  dialogOpenMessage,
} from '../../redux/dialog/DialogActions';
import Footer from '../../libs/footer';
import {
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
  screenWidth,
} from '../../services/util';
import routes from '../../libs/routes';

export default function Examright({route, navigation}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <ScrollView style={styles.root}>
        <View
          style={{
            width: '90%',
            left: widthPercentage(17),
          }}>
          <TextWrap style={styles.font3}>
            문해고사를 통해 문해력 UP 시키기!
          </TextWrap>
        </View>
        <View style={styles.root2}>
          <Image style={styles.img1} source={images.exam_top} />
          <Image style={styles.img3} source={images.right} />
          <TextWrap
            style={{
              fontSize: fontPercentage(12),
              fontWeight: 'bold',
            }}>
            ③번 '얼굴에 화색이 돌다
          </TextWrap>
          <Image style={styles.img2} source={images.exam_body1} />
        </View>
        <TextWrap style={styles.font}>
          '얼굴이 피다'는 '얼굴에 살이 오르고 화색이 돌다.'라는 뜻의
          관용구입니다.
          {'\n'}
          {'\n'}
          유정이와 미진이의 대화를 살펴보면 오랜만에 만난 미진이가 유정이의
          얼굴을 보며 "얼굴이 완전 폈네~"라고 말합니다.
          {'\n'}
          {'\n'}
          이는 상대방의 얼굴이 예뻐졌거나, 얼굴에 화색이 돌아 보기 좋다는 의미를
          나타냅니다.
          {'\n'}
          {'\n'}
        </TextWrap>
        <TextWrap style={styles.exfont}>
          [참고예시]]
          {'\n'}
          1. 진영이가 요즘 좋은 일이 많은지, 얼굴이 폈다.
          {'\n'}
          2.보약을 먹더니 얼굴이 피었다.
          {'\n'}
          3. 전보다 얼굴이 많이 펴서 보기 좋다.
        </TextWrap>

        <View style={styles.button}>
          <Button
            title="다른 활동하기"
            color="black"
            onPress={() => {
              navigate(routes.home, {
                screen: routes.topActivity,
                params: {
                  type: 'main',
                  key: Date.now(),
                },
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    top: 10,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  button: {
    left: '5%',
    width: screenWidth * 0.9,
    top: heightPercentage(20),
    height: screenHeight / 11,
  },
  root2: {
    top: heightPercentage(30),
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    marginRight: widthPercentage(30),
    left: widthPercentage(17),
    fontSize: fontPercentage(12),
    fontWeight: 'bold',
  },
  exfont: {
    marginRight: widthPercentage(30),
    left: widthPercentage(17),
    fontSize: fontPercentage(12),
    fontWeight: 'bold',
    color: 'gray',
  },
  font3: {
    top: heightPercentage(15),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  font2: {
    margin: widthPercentage(10),
    left: widthPercentage(8),
    top: heightPercentage(12),
    fontSize: fontPercentage(11),
  },
  img1: {
    width: '90%',
    height: screenHeight / 4,
    bottom: heightPercentage(8),
    resizeMode: 'stretch',
  },
  img2: {
    height: screenHeight / 2,
    width: '90%',
    resizeMode: 'stretch',
  },
  img3: {
    width: screenWidth,
    height: screenHeight / 6,
    resizeMode: 'contain',
    bottom: heightPercentage(20),
    top: 5,
  },
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
