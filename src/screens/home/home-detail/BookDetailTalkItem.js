import React, {useState} from 'react';
import moment from 'moment';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import TextWrap from '../../../components/text-wrap/TextWrap';
import StarRating from 'react-native-star-rating';
import {navigate} from '../../../services/navigation';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import fonts from '../../../libs/fonts';
import images from '../../../libs/images';
import routes from '../../../libs/routes';
import {
  fontPercentage,
  formatTime,
  screenWidth,
  widthPercentage,
} from '../../../services/util';
import HTMLView from 'react-native-htmlview';

export default function BookDetailTalkItem({
  regDate,
  contents,
  memberId,
  starRate,
  bookHashtag,
}) {
  return (
    <View style={styles.mainContent}>
      <View style={styles.titleContainer}>
        <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.title}>
          {memberId}
        </TextWrap>
        <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.regDate}>
          {regDate && moment(regDate).format('YYYY.MM.DD')}
        </TextWrap>
      </View>

      <View style={styles.starContainer}>
        <StarRating
          disabled={true}
          halfStarEnabled={true}
          emptyStar={images.recommend}
          fullStar={images.recommendActive}
          halfStar={images.recommendHalf}
          maxStars={5}
          starSize={14}
          rating={starRate}
          // selectedStar={rating => onStarRatingPress(rating)}
        />
      </View>
      <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.descText}>
        {contents}
      </TextWrap>

      <TextWrap font={fonts.kopubWorldDotumProMedium} style={styles.hashText}>
        {bookHashtag && (
          <TextWrap>
            {bookHashtag.map((data, hashIndex) => {
              if (!data) {
                return;
              }
              return (
                <TouchableOpacity
                  key={hashIndex}
                  onPress={() =>
                    navigate(routes.hashTagImage, {
                      screen: routes.hashTagPopularImage,
                      params: {
                        hashTag: data,
                        infoType: 'popular',
                        key: Date.now(),
                      },
                    })
                  }>
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
      </TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  descText: {
    color: colors.black,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(16),
  },
  hashText: {
    color: colors.blue,
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(16),
    marginTop: 10,
  },

  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  mainContent: {flex: 1, marginTop: 10},
  titleContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
  },
  title: {
    color: '#9D9D9D',
    fontSize: fontPercentage(13),
  },
  regDate: {
    color: '#9D9D9D',
    fontSize: fontPercentage(12),
    top: 1,
  },
  starContainer: {
    alignItems: 'flex-start',
    marginTop: 1,
    marginBottom: 10,
    left: -1,
  },
  hashTags: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(19),
    color: '#004ac9',
  },
});