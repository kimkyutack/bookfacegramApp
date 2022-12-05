import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import TextWrap from '../text-wrap/TextWrap';
import { widthPercentage, heightPercentage } from '../../services/util';

export default function CheckBox2({
  checked,
  onCheckedChange,
  style,
  bold,
  label,
  border,
  labelStyle,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onCheckedChange(!checked);
      }}
      style={[styles.root, style]}>
      <Image
        source={checked ? images.checkboxOn : images.checkboxOff}
        style={styles.check}
      />
      <TextWrap
        font={
          bold ? fonts.kopubWorldDotumProBold : fonts.kopubWorldDotumProMedium
        }
        style={[
          styles.label,
          bold && {color: '#222'},
          border && {
            borderBottomWidth: 1,
            borderBottomColor: '#777',
          },
          labelStyle && labelStyle,
        ]}>
        {label}
      </TextWrap>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
  },
  check: {
    marginTop:1,
    width: widthPercentage(20),
    height: heightPercentage(20),
    marginRight: 1,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 15,
    lineHeight: 19,
    color: '#777777',
  },
});
