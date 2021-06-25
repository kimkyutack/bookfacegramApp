import React from 'react';
import {StyleSheet} from 'react-native';

import Ripple from 'react-native-material-ripple';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';

export default function ButtonWrap({
  onPress,
  disabled,
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
        font={font || fonts.notoSansCjkKrRegular}>
        {children}
      </TextWrap>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#fec400',
    borderRadius: 30,
  },
  rootOutLine: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 30,
  },
  button: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 19,
  },
  buttonOutline: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 19,
  },
  rootEnabled: {
    backgroundColor: '#c7c7c7',
    borderWidth: 0,
    color: '#000000',
  },
  buttonEnabled: {
    color: colors.white,
  },
});
