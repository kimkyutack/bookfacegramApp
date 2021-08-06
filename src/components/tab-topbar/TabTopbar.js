import React from 'react';
import {StyleSheet, View} from 'react-native';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';

export default function TabTopBar({title, children}) {
  return (
    <View style={styles.root}>
      <TextWrap font={fonts.kopubWorldDotumProBold} style={styles.title}>
        {title}
      </TextWrap>
      <View style={styles.options}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  options: {flexDirection: 'row', alignItems: 'center'},
  title: {
    marginLeft: 16,
    marginVertical: 16,
    lineHeight: 29,
    color: '#222222',
    fontSize: 24,
  },
});
