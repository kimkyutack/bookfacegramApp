import React from 'react';
import {FlatList, View, TouchableOpacity, StyleSheet} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
} from '../../services/util';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import Avatar from '../../components/avatar/Avatar';

const renderItem = ({
  followerIdx,
  memberId,
  memberIdx,
  profilePath,
  status,
  onPress,
  tabIndex,
  index,
}) => {
  return (
    <View
      style={index === 0 ? styles.itemContainerFirst : styles.itemContainer}>
      <TouchableOpacity style={styles.infoContainer} onPress={onPress}>
        <Avatar
          size={widthPercentage(38)}
          style={styles.avator}
          path={
            profilePath
              ? profilePath
              : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
          }
        />
        <TextWrap style={styles.info}>{memberId}</TextWrap>
      </TouchableOpacity>
      <ButtonWrap
        // onPress={() => console.log('삭제')}
        style={styles.button}
        font={fonts.kopubWorldDotumProMedium}
        styleTitle={styles.buttonTitle}>
        {tabIndex === 0 ? '삭제' : '팔로잉'}
      </ButtonWrap>
    </View>
  );
};

export const FollowItem = React.memo(renderItem);

const styles = StyleSheet.create({
  itemContainerFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: heightPercentage(14),
  },
  infoContainer: {
    flexDirection: 'row',
  },
  info: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(17),
    alignSelf: 'center',
    paddingLeft: widthPercentage(19),
  },
  avator: {
    resizeMode: 'cover',
  },
  button: {
    borderWidth: 0.5,
    borderColor: '#707070',
    backgroundColor: colors.white,
    borderRadius: 0,
    width: widthPercentage(50),
    height: heightPercentage(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(16),
  },
});
