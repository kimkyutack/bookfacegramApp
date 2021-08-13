import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Avatar from '../avatar/Avatar';
import TextWrap from '../text-wrap/TextWrap';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
} from '../../services/util';

export default function SearchListItem({
  id,
  name,
  profilePath,
  onItemPress,
  index,
}) {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View
        style={[styles.root, index === 0 && {marginTop: heightPercentage(20)}]}>
        <Avatar
          size={widthPercentage(38)}
          path={
            profilePath
              ? profilePath
              : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
          }
        />
        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProLighto} style={styles.name}>
            {name && name}
          </TextWrap>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginTop: heightPercentage(14),
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: widthPercentage(19),
  },
  name: {
    color: '#222',
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(17),
  },
});
