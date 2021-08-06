import React, {useEffect, useState, useRef} from 'react';

import {StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
export default function ButtonBox({
  grade,
  pressButtonIdx,
  pressButtonArr,
  loading,
  children,
  style,
  onPress,
  disabled,
  disabledStyle,
  fontStyle,
}) {
  return (
    <Ripple
      style={[
        styles.root,
        style,
        disabled && styles.rootDisabled,
        disabledStyle && disabledStyle,
        pressButtonArr
          ? pressButtonArr.indexOf(grade) !== -1 && {
              backgroundColor: colors.prussianBlue,
            }
          : grade === pressButtonIdx && {backgroundColor: colors.prussianBlue},
      ]}
      disabled={loading || disabled}
      onPress={onPress}>
      <TextWrap
        font={fonts.kopubWorldDotumProMedium}
        style={[
          styles.label,
          disabled && styles.labelDisabled,
          fontStyle && fontStyle,
          // disabledStyle && disabledStyle,
          disabledStyle ? disabledStyle : fontStyle,
        ]}>
        {children}
      </TextWrap>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPercentage(46),
    alignSelf: 'stretch',
    backgroundColor: colors.white,
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
