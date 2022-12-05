import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {screenWidth, fontPercentage, heightPercentage} from '../../services/util';
import TextWrap from '../text-wrap/TextWrap';

export default function NoFound({message}) {
  return (
    <View style={message == '검색조건에 해당하는 독서모임이 없습니다.' ? styles.root2 : styles.root}>
      <Image source={images.nodata} style={styles.nodata} />
      <TextWrap style={styles.text} font={fonts.barlowMedium}>
        {message || '검색 결과가 없습니다.'}
      </TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 100,
    color: '#999',
    // paddingTop: '40%',
  },
  root2: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: heightPercentage(100),
    color: '#999',
    marginBottom:heightPercentage(100),
    // paddingTop: '40%',
  },
  nodata: {
    width: screenWidth / 10,
    height: screenWidth / 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(21),
    color: '#999',
  },
});
