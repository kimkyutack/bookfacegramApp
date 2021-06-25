import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';

export default function Length({
  children,
  top,
  left,
  right,
  bottom,
  flex,
  style,
}) {
  return (
    <View
      style={[
        styles.requestWrap,
        top !== undefined && {top},
        left !== undefined && {left},
        right !== undefined && {right},
        bottom !== undefined && {bottom},
        flex && {position: 'relative'},
        style,
      ]}>
      <TextWrap style={styles.request}>{children}</TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  requestWrap: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#fe5f55',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  request: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 13,
  },
});
