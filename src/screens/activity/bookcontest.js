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
import colors from '../../libs/colors';
import SearchBar from '../../components/search-bar/SearchBar';
import Topbar from '../../components/topbar/Topbar';
import images from '../../libs/images';
import TextWrap from '../../components/text-wrap/TextWrap';
import {
  dialogError,
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

export default function BookContest({route, navigation}) {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={styles.root}>
        <TextWrap style={styles.font}>자유로운 형식의 독후감대회!</TextWrap>
        <View style={styles.root2}>
          <Image style={styles.img1} source={images.competition_1} />
        </View>
        <View style={styles.button}>
          <Button
            title="공모전 응모하기"
            color="black"
            onPress={() => dispatch(dialogError('시험 기간이 아닙니다.'))}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  button: {
    left: '5%',
    width: '90%',
    bottom: '1%',
  },
  root2: {
    top: heightPercentage(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    height: screenHeight * 2,
  },
  font: {
    left: widthPercentage(20),
    top: heightPercentage(15),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  img1: {
    width: '90%',
    height: '97%',
    bottom: heightPercentage(10),
    resizeMode: 'stretch',
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
