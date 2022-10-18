import React from 'react';
import {useDispatch} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  Button,
} from 'react-native';
import colors from '../../libs/colors';
import images from '../../libs/images';
import TextWrap from '../../components/text-wrap/TextWrap';
import {
  dialogError,
} from '../../redux/dialog/DialogActions';
import {
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import FastImage from 'react-native-fast-image';

export default function Kbstest({route, navigation}) {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={styles.root}>
        <TextWrap style={styles.font}>
          책과함께, KBS한국어능력시험 대비하기!
        </TextWrap>
        <View style={styles.root2}>
          <FastImage
                      source={images.title_img}
                      resizeMode="stretch"
                      style={styles.img1}
                    />

        </View>
        <View style={Platform.OS === 'ios' ? styles.buttonIos : styles.button }>
          <Button
            title="시험 응시하기"
            color={Platform.OS === 'ios' ?  "white" : "black"}
          
            onPress={() => dispatch(dialogError('시험 기간이 아닙니다.'))}
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
  buttonIos: {
    left: '5%',
    width: '90%',
    bottom: '1%',
    backgroundColor: 'black',
  },
  button: {
    left: '5%',
    width: '90%',
    bottom: '1%',
  },
  root2: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: screenHeight * 1.9,
    flexDirection: 'row',
    bottom: heightPercentage(25),
  },
  font: {
    left: widthPercentage(20),
    top: heightPercentage(15),
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
  img1: {
    width: '90%',
    height: '100%',
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
