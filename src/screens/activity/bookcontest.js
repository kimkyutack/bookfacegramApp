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
import {dialogError} from '../../redux/dialog/DialogActions';
import {
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import FastImage from 'react-native-fast-image';

export default function BookContest({route, navigation}) {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={styles.root}>
        <TextWrap style={styles.font}>
          자유로운 형식의 독후감대회!
        </TextWrap>
        <View style={styles.root2}>
          <FastImage
                      source={images.competition_1}
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
    backgroundColor: '#ffffff',
  },
  button: {
    left: '5%',
    width: '90%',
    bottom: '1%',
  },
  buttonIos: {
    left: '5%',
    width: '90%',
    bottom: '1%',
    backgroundColor: 'black',
  },
  root2: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    height: screenHeight * 1.95,
    marginBottom: heightPercentage(60),
    top:heightPercentage(25),
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
