import React from 'react';
import {StyleSheet} from 'react-native';

import Ripple from 'react-native-material-ripple';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import {fontPercentage} from '../../services/util';
import TextWrap from '../text-wrap/TextWrap';

export default function ButtonWrap({
  onPress,
  disabled,
  disabledBackgroundColor,
  loading,
  children,
  outline,
  font,
  styleTitle = {},
  style = {},
}) {
  return (
    <Ripple
      style={[
        outline ? styles.rootOutLine : styles.root,
        disabled && styles.rootEnabled,
        disabledBackgroundColor && disabledBackgroundColor,
        style,
      ]}
      disabled={loading || Boolean(disabled)}
      onPress={onPress}>
      <TextWrap
        style={[
          outline ? styles.buttonOutline : styles.button,
          disabled && styles.rootEnabled,
          styleTitle,
        ]}
        font={font || fonts.kopubWorldDotumProMedium}>
        {children}
      </TextWrap>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: '#fec400',
    borderRadius: 30,
  },
  rootOutLine: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderWidth: 0.2,
    borderColor: '#888888',
    borderRadius: 30,
  },
  button: {
    fontSize: fontPercentage(15),
    color: colors.black,
    lineHeight: fontPercentage(23),
  },
  buttonOutline: {
    fontSize: fontPercentage(10),
    lineHeight: fontPercentage(19),
    color: '#333333',
  },
  rootEnabled: {
    backgroundColor: colors.white,
    borderWidth: 0,
    color: colors.black,
  },
  buttonEnabled: {
    color: colors.white,
  },
});
