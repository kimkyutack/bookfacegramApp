import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';

import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {heightPercentage, widthPercentage} from '../../services/util';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';

const HashTagFeedItemCarousel = ({feedImgName, onPress}) => {
  return (
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
      {feedImgName?.map((url, index) => {
        return (
          <TouchableWithoutFeedback onPress={onPress} key={index?.toString()}>
            <FastImage
              source={{
                uri: feedImgName?.length
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
  );
};

export default React.memo(HashTagFeedItemCarousel);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: widthPercentage(360),
    height: heightPercentage(360),
    resizeMode: 'cover',
  },
});
