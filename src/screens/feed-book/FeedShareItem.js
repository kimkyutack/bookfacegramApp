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
import Swiper from 'react-native-swiper';

const toStringByFormatting = (source) => {
   const year = source.substring(0,4); 
   const month = source.substring(5,7); 
   const day = source.substring(8,10); 
   return year + '.' + month +'.' + day; 
  }


const renderItem = ({
  feeditem,
  index,
}) => {
  const replacecontents = feeditem.contents.replace(/&nbsp/g, ' ');
  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <TouchableOpacity
          style={styles.infoContainerEdit}>
          <Avatar
            size={widthPercentage(25)}
            style={styles.avator}
            path={
              feeditem.profile
                ? feeditem.profile
                : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
            }
          />
          <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.info}>
            {feeditem.memberId}
          </TextWrap>
        </TouchableOpacity>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          width={widthPercentage(360)}
          height={heightPercentage(360)}
          removeClippedSubviews={false}
          dotColor={colors.border}
          activeDotColor={colors.blue}
          dotStyle={{top: 10}}
          activeDotStyle={{top: 10}}
          nextButton={<Text />}
          prevButton={<Text />}>
          {feeditem.feedImgName?.map((url, index) => {
            return (
              <TouchableWithoutFeedback key={index?.toString()}>
                <FastImage
                  source={{
                    uri: feeditem.feedImgName?.length
                      ? consts.imgUrl + '/feedBook/' + url
                      : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png',
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.image}
                />
              </TouchableWithoutFeedback>
            );
          })}
        </Swiper>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.contentCountContainer}>
          <TouchableOpacity
            style={styles.iconContainer}>
              <Image style={styles.icon} source={images.heart} />
          </TouchableOpacity>
          <TextWrap style={styles.contentLetter}>
            {feeditem.likeCnt ? feeditem.likeCnt : 0}개
          </TextWrap>
          <TouchableOpacity
            style={[styles.iconContainer, {marginLeft: widthPercentage(10)}]}>
            <Image style={styles.icon} source={images.comment} />
          </TouchableOpacity>
          <TextWrap style={styles.contentLetter}>
            {feeditem.replyCnt ? feeditem.replyCnt : 0}개
          </TextWrap>
          <TouchableOpacity
            style={[styles.iconContainer, {marginLeft: widthPercentage(10)}]}>
            <Image style={styles.icon2} source={images.share} />
          </TouchableOpacity>
        </View>
        <View>
          <TextMoreWrap
            numOfLines={2}
            font={fonts.kopubWorldDotumProMedium}
            style={styles.contents}
            timeKey={Date.now()}
            index={index}>
            {feeditem.contents
              ? replacecontents.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n')
              : ''}
          </TextMoreWrap>
        </View>
        <View>
          {feeditem.feedHashtag && (
            <TextWrap>
              {feeditem.feedHashtag.map((data, hashIndex) => {
                if (!data) {
                  return;
                }
                return (
                  <TouchableOpacity key={hashIndex}>
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
        <View>
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.joinDate}>
            {feeditem.regDate ? toStringByFormatting(feeditem.regDate.substring(0,10)) : ''}
          </TextWrap>
        </View>
      </View>
    </View>
  );
};

export const FeedShareItem = React.memo(renderItem);

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
  infoRight: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(17),
    alignSelf: 'center',
  },
  infoContainerEdit: {
    width: widthPercentage(130),
    height: heightPercentage(35),
    flexDirection: 'row',
    alignItems: 'center',
  },
  editOpenIcon: {
    width: widthPercentage(12),
    height: widthPercentage(12),
    resizeMode: 'contain',
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
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(20),
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
    fontSize: fontPercentage(13),
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
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(19),
    paddingLeft: widthPercentage(6),
    alignSelf: 'center',
    color: '#acacac',
  },
  contents: {
    marginTop: heightPercentage(10),
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(19),
  },

  joinDate: {
    fontSize: fontPercentage(10),
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
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
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
  wrapper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
