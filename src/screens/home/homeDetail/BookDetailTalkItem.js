import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../../components/text-wrap/TextWrap';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import fonts from '../../../libs/fonts';
import images from '../../../libs/images';
import {fontPercentage, formatTime, screenWidth} from '../../../services/util';
import HTMLView from 'react-native-htmlview';

export default function BookDetailTalkItem({
  register_dt,
  comment,
  register,
  hash,
  index,
}) {
  return (
    <View style={styles.mainContent}>
      <View style={styles.titleContainer}>
        <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
          {register}
        </TextWrap>
        <TextWrap style={styles.title}>{register_dt}</TextWrap>
      </View>

      <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.descText}>
        {comment}
      </TextWrap>

      <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.hashText}>
        {hash}
      </TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  descText: {
    color: colors.black,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(16),
  },
  hashText: {
    color: colors.blue,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(16),
    marginTop: 10,
  },

  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  mainContent: {flex: 1, marginTop: 10},
  titleContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 10,
  },
  title: {
    color: '#9D9D9D',
    fontSize: fontPercentage(13),
  },
});
