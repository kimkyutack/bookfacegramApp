import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import images from '../../libs/images';
import TextWrap from '../text-wrap/TextWrap';

export default function Radio({label, value, onChange, style, disabled}) {
  return (
    <TouchableOpacity
      style={[styles.root, style]}
      disabled={disabled && true}
      onPress={() => {
        onChange(!value);
      }}>
      <Image
        style={styles.radio}
        source={value ? images.radioOn : images.radioOff}
      />
      <TextWrap style={[styles.label, !value && styles.ls]}>{label}</TextWrap>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
  },
  ls: {color: '#ababab'},
  radio: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});
