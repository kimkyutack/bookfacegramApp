import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Animated,
  Image,
  FlatList,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import Icon from 'react-native-vector-icons/AntDesign';
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
import FastImage from 'react-native-fast-image';

import {navigate} from '../../services/navigation';
import Avatar from '../../components/avatar/Avatar';
import TextMoreWrap from '../../components/text-more-wrap/TextMoreWrap';
import consts from '../../libs/consts';

const renderItem = ({
  feedIdx,
  memberId,
  memberIdx,
  profile,
  userProfile,
  feedImgName,
  likeCnt,
  likeMemberList,
  replyCnt,
  contents,
  joinDate,
  index,
  feedHashtag,
  login_id,
  login_idx,
  editOnPress,
  onShare,
  toggleHeart,
  handleDoubleTap,
  opacity,
  toggleIndex,
}) => {
  const idx = likeMemberList.indexOf(login_idx);
  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <TouchableOpacity
          style={styles.infoContainerEdit}
          onPress={() => {
            navigate(routes.feedBookImage, {
              screen: routes.feedBookUserImage,
              params: {
                memberId: memberId,
                memberIdx: memberIdx,
                key: Date.now(),
              },
            });
          }}>
          <Avatar
            size={widthPercentage(25)}
            style={styles.avator}
            path={
              profile
                ? profile
                : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
            }
          />
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.info}>
            {/* {memberId} */}
            {memberId?.split('@')[0]}
          </TextWrap>
        </TouchableOpacity>
        <View>
          {memberId === login_id && (
            <TextWrap
              font={fonts.kopubWorldDotumProMedium}
              style={styles.infoRight}
              onPress={editOnPress}>
              수정
            </TextWrap>
          )}
        </View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            handleDoubleTap(feedIdx);
          }}>
          <FastImage
            source={{
              uri: feedImgName?.length
                ? consts.imgUrl + '/feedBook/' + feedImgName[0]
                : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp',
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={styles.image}
          />
        </TouchableWithoutFeedback>
        {feedIdx === toggleIndex &&
          (idx !== -1 ? (
            <Animated.View style={{position: 'absolute', opacity: opacity}}>
              <Icon name="heart" size={50} color={'#ea0000'} />
            </Animated.View>
          ) : (
            <Animated.View style={{position: 'absolute', opacity: opacity}}>
              <Icon name="hearto" size={50} color={'white'} />
            </Animated.View>
          ))}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.contentCountContainer}>
          <TouchableOpacity
            onPress={() => toggleHeart(feedIdx)}
            style={styles.iconContainer}>
            {idx !== -1 ? (
              <Icon name="heart" size={widthPercentage(19)} color={'#ea0000'} />
            ) : (
              <Icon
                name="hearto"
                size={widthPercentage(19)}
                color={'#595959'}
              />
            )}
          </TouchableOpacity>
          <TextWrap style={styles.contentLetter}>
            {likeCnt ? likeCnt : 0}개
          </TextWrap>
          <TouchableOpacity
            onPress={() =>
              navigate(routes.comment, {
                timeKey: Date.now(),
                feedIdx: feedIdx,
                memberId: memberId,
                memberIdx: memberIdx,
              })
            }
            style={[styles.iconContainer, {marginLeft: widthPercentage(10)}]}>
            <Image style={styles.icon} source={images.comment} />
          </TouchableOpacity>
          <TextWrap style={styles.contentLetter}>
            {replyCnt ? replyCnt : 0}개
          </TextWrap>
          <TouchableOpacity
            onPress={onShare}
            style={[styles.iconContainer, {marginLeft: widthPercentage(10)}]}>
            <Image style={styles.icon2} source={images.share} />
          </TouchableOpacity>
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
        <View>
          {feedHashtag && (
            <TextWrap>
              {feedHashtag.map((data, hashIndex) => {
                if (!data) {
                  return;
                }
                return (
                  <TouchableOpacity
                    key={hashIndex}
                    // onPress={() => console.log(data)}
                  >
                    <TextWrap
                      font={fonts.kopubWorldDotumProLight}
                      style={styles.hashTags}>
                      {data && `#${data} `}
                    </TextWrap>
                  </TouchableOpacity>
                );
              })}
            </TextWrap>
          )}
        </View>
        <TouchableOpacity
          style={styles.replyContainer}
          onPress={() =>
            navigate(routes.comment, {
              timeKey: Date.now(),
              feedIdx: feedIdx,
              memberId: memberId,
              memberIdx: memberIdx,
            })
          }>
          <Avatar
            size={widthPercentage(17)}
            style={styles.avator}
            path={
              userProfile
                ? userProfile
                : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
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

export const FeedUserItem = React.memo(renderItem);

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    borderTopColor: colors.borderLine,
    borderTopWidth: 1,
    // height: 'heightPercentage(543.4)',
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
    alignItems: 'flex-end',
  },

  hashTags: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    color: '#004ac9',
  },
  contentLetter: {
    position: 'relative',
    bottom: -2,
    left: 1,
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
  iconContainer: {
    width: widthPercentage(22),
    height: widthPercentage(22),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  icon: {
    width: widthPercentage(19),
    height: widthPercentage(19),
    resizeMode: 'contain',
  },
  icon2: {
    width: widthPercentage(17),
    height: widthPercentage(17),
    resizeMode: 'contain',
  },
});
