import React from 'react';
import {FlatList, View, TouchableOpacity, StyleSheet} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import FastImage from 'react-native-fast-image';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  screenWidth,
} from '../../services/util';
import fonts from '../../libs/fonts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import routes from '../../libs/routes';

import {navigate} from '../../services/navigation';
import Avatar from '../../components/avatar/Avatar';
import TextMoreWrap from '../../components/text-more-wrap/TextMoreWrap';

const renderItem = ({
  id,
  member_id,
  uri,
  likes,
  replys,
  contents,
  joinDate,
  index,
  login_id,
  editOnPress,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <TouchableOpacity
          style={styles.infoContainerEdit}
          onPress={() => console.log(member_id)}>
          <Avatar
            size={widthPercentage(25)}
            style={styles.avator}
            path={
              'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
              // uri
              //   ? uri
              //   : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
            }
          />
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.info}>
            {member_id}
          </TextWrap>
        </TouchableOpacity>
        <View>
          {member_id === login_id ? (
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.infoRight}
              onPress={editOnPress}>
              수정
            </TextWrap>
          ) : (
            <></>
          )}
        </View>
      </View>
      <FastImage
        source={{
          // uri: item.uri,
          uri: 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp',
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <View style={styles.contentCountContainer}>
          <TextWrap>하트{likes ? likes : 0}개</TextWrap>
          <TextWrap style={styles.contentCountPadding}>
            댓글{replys ? replys : 0}개
          </TextWrap>
          <TextWrap style={styles.contentCountPadding}>공유</TextWrap>
        </View>
        <View>
          <TextMoreWrap
            numOfLines={2}
            font={fonts.kopubWorldDotumProMedium}
            style={styles.contents}
            index={index}>
            {contents ? contents : ''}
          </TextMoreWrap>
        </View>
        <TouchableOpacity
          style={styles.replyContainer}
          onPress={() =>
            navigate(routes.comment, {
              timeKey: Date.now(),
              id: id,
              member_id: member_id,
            })
          }>
          <Avatar
            size={widthPercentage(17)}
            style={styles.avator}
            path={
              'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
              // uri
              //   ? uri
              //   : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
            }
          />
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.reply}>
            댓글 달기...
          </TextWrap>
        </TouchableOpacity>
        <View>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.joinDate}>
            {joinDate ? joinDate : ''}
          </TextWrap>
        </View>
      </View>
    </View>
  );
};

export const FeedItem = React.memo(renderItem);

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    borderTopColor: colors.borderLine,
    borderTopWidth: 1,
  },
  infoContainer: {
    height: heightPercentage(35),
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyContainer: {
    height: heightPercentage(17),
    flexDirection: 'row',
    marginTop: heightPercentage(13),
    marginBottom: heightPercentage(11),
    width: screenWidth,
    alignItems: 'center',
  },
  infoContainerEdit: {
    width: widthPercentage(130),
    height: heightPercentage(35),
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  contentCountContainer: {
    flexDirection: 'row',
  },
  contentCountPadding: {
    paddingLeft: widthPercentage(10),
  },
  avator: {
    resizeMode: 'cover',
  },
  info: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(17),
    paddingLeft: widthPercentage(5),
    alignSelf: 'center',
  },
  infoRight: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(17),
    alignSelf: 'center',
  },
  reply: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    paddingLeft: widthPercentage(6),
    alignSelf: 'center',
    color: '#acacac',
  },
  contents: {
    marginTop: heightPercentage(10),
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    // height: heightPercentage(35),
  },
  joinDate: {
    fontSize: fontPercentage(8),
    lineHeight: fontPercentage(19),
    color: '#333333',
  },

  image: {
    width: widthPercentage(360),
    height: heightPercentage(360),
    resizeMode: 'cover',
  },
});
