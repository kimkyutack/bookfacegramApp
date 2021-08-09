import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../../components/text-wrap/TextWrap';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import fonts from '../../../libs/fonts';
import images from '../../../libs/images';
import {formatTime, screenWidth} from '../../../services/util';
import HTMLView from 'react-native-htmlview';

export default function BookDetailQuiz({}) {
  return (
    <View>
      <TextWrap style={styles.noData} font={fonts.kopubWorldDotumProLight}>
        해당 도서는 독서퀴즈 서비스가{'\n'}제공되지 않습니다.
      </TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  noData: {
    marginTop: 40,
    textAlign: 'center',
  },
});
