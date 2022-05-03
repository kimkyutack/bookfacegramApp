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
} from '../../services/util';
import routes from '../../libs/routes';

export default function Examtest({route, navigation}) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={styles.root}>
        <View style={styles.root2}>
          <Image style={styles.img1} source={images.exam_top} />
          <Image style={styles.img1} source={images.right} />
          <Image style={styles.img1} source={images.exam_body1} />
        </View>
        <TextWrap style={styles.font}>
          위의 대화는 오랜만에 만난 유정이와 미진이의 대화입니다. 밑줄친 '
          <TextWrap style={styles.font3}>얼굴이 피다</TextWrap>' 의 뜻은 무슨
          의미일까요?
        </TextWrap>
        <View style={styles.button}>
          <Button
            title="다른 활동하기"
            color="black"
            onPress={() => alert('정답')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  button: {
    left: '5%',
    width: '90%',
    bottom: '1%',
  },
  root2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    marginRight: widthPercentage(30),
    left: widthPercentage(17),
    top: heightPercentage(6),
    fontSize: fontPercentage(12),
    fontWeight: 'bold',
  },
  font3: {
    fontSize: fontPercentage(12),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  font2: {
    margin: widthPercentage(10),
    left: widthPercentage(8),
    top: heightPercentage(12),
    fontSize: fontPercentage(11),
  },
  img1: {
    resizeMode: 'contain',
    flex: 1,
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
