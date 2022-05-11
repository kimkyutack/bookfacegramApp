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
  tabIndex,
  memberId,
  profilePath,
  onItemPress,
  hashTagList,
  index,
}) {
  if (tabIndex === 0) {
    return (
      <TouchableOpacity onPress={onItemPress}>
        <View
          style={[
            styles.root,
            index === 0 && {marginTop: heightPercentage(20)},
          ]}>
          <Avatar
            size={widthPercentage(38)}
            path={
              profilePath
                ? profilePath
                : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
            }
          />
          <View style={styles.main}>
            <TextWrap font={fonts.kopubWorldDotumProLight} style={styles.name}>
              {memberId}
            </TextWrap>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return hashTagList?.split(',')?.map((x, i) => {
      return (
        <TouchableOpacity onPress={() => onItemPress(x)} key={i}>
          <View
            style={[
              styles.root,
              index === 0 && {marginTop: heightPercentage(20)},
            ]}>
            <Avatar size={widthPercentage(38)} source={images.hashTag} />
            <View style={styles.main}>
              <TextWrap
                font={fonts.kopubWorldDotumProLight}
                style={styles.name}>
                {x}
              </TextWrap>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
    // <TouchableOpacity onPress={onItemPress}>
    //   <View
    //     style={[
    //       styles.root,
    //       index === 0 && {marginTop: heightPercentage(20)},
    //     ]}>
    //     <Avatar size={widthPercentage(38)} source={images.hashTag} />
    //     <View style={styles.main}>
    //       <TextWrap font={fonts.kopubWorldDotumProLight} style={styles.name}>
    //         {hashTagList?.toString()}
    //       </TextWrap>
    //     </View>
    //   </View>
    // </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
