import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Avatar from '../../components/avatar/Avatar';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import {parseName} from '../../services/util';

export default function BookItem({title}) {
  return <TextWrap>{title}</TextWrap>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 8,
  },
});
