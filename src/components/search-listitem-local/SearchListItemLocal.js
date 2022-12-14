import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Avatar from '../avatar/Avatar';
import ButtonImage from '../button-image/ButtonImage';
import TextWrap from '../text-wrap/TextWrap';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import {fontPercentage, widthPercentage} from '../../services/util';

export default function SearchListItemLocal({
  onDelete,
  memberId,
  profilePath,
  showStatus,
  index,
  tabIndex,
  fetchAccount,
  fetchHashTag,
  setText,
}) {
  return (
    <TouchableOpacity
      onPress={
        tabIndex === 1
          ? () => {
              setText(memberId);
              fetchHashTag(memberId);
            }
          : () => {
              setText(memberId);
              fetchAccount(memberId);
            }
      }>
      <View style={styles.root} key={index}>
        <View style={styles.main}>
          <TextWrap font={fonts.kopubWorldDotumProLight} style={styles.name}>
            {memberId}
          </TextWrap>
        </View>
        <ButtonImage
          onPress={onDelete}
          paddingVertical={14}
          paddingHorizontal={16}
          size={12}
          source={images.delete}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    // paddingLeft: widthPercentage(19)
  },
  name: {
    color: '#222',
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(17),
  },
});
