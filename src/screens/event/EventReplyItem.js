import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/image';
import {formatTime, screenWidth} from '../../services/util';
import HTMLView from 'react-native-htmlview';

export default function EventReplyItem({
  register_dt,
  comment,
  register,
  index,
}) {
  return (
    <View style={[styles.mainContent && {marginTop: 10}]}>
      <View style={styles.titleContainer}>
        <TextWrap font={fonts.robotoMedium} style={styles.title}>
          {register}
        </TextWrap>
        <TextWrap style={styles.title}>{register_dt}</TextWrap>
      </View>

      <TextWrap font={fonts.robotoMedium} style={styles.descText}>
        {comment}
      </TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  descText: {
    color: colors.black,
    fontSize: 12,
    lineHeight: 14,
  },
  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  mainContent: {flex: 1},
  titleContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 10,
  },
  title: {
    color: '#9D9D9D',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
  },
});
