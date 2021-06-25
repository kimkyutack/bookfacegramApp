import React from 'react';
import {StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';

export default function ButtonBox({
  loading,
  children,
  style,
  onPress,
  disabled,
}) {
  return (
    <Ripple
      style={[styles.root, style, disabled && styles.rootDisabled]}
      disabled={loading || disabled}
      onPress={onPress}>
      <TextWrap
        font={fonts.robotoMedium}
        style={[styles.label, disabled && styles.labelDisabled]}>
        {children}
      </TextWrap>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
  },
  rootDisabled: {
    backgroundColor: '#dcdcdc',
  },
  labelDisabled: {
    color: '#777777',
  },
  label: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 21,
  },
});
