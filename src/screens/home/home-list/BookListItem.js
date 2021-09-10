import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';
import moment from 'moment-timezone';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import fonts from '../../../libs/fonts';
import routes from '../../../libs/routes';
import images from '../../../libs/images';
import {navigationRef, navigate} from '../../../services/navigation';
import {
  fontPercentage,
  formatTime,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../../services/util';
import {numFormat} from '../../../services/util';
import TextWrap from '../../../components/text-wrap/TextWrap';
import BookMainCarouselImage from '../home-main/BookMainCarouselImage';
import {setTab} from '../../../redux/tab/TabAction';

export default function BookListItem({item, index, grade, th, gradeStyle}) {
  const dispatch = useDispatch();
  return (
    <>
      {index === 0 ? (
        grade === null ? (
          <View style={styles.headerContainer}>
            <TextWrap style={styles.header} font={fonts.kopubWorldDotumProBold}>
              신간을 확인해 보세요!
            </TextWrap>
            <TextWrap
              style={styles.subHeader}
              font={fonts.kopubWorldDotumProMedium}>
              이번 달 새롭게 출간된 신간을 소개합니다.
            </TextWrap>
          </View>
        ) : (
          <View style={styles.headerContainer}>
            <TextWrap
              style={styles.cardHeaderTitle}
              font={fonts.kopubWorldDotumProBold}>
              {moment().format('YYYY')}년도 [제{th}회]{'\n'}
              <Text style={styles.blueText}>책과함께, KBS한국어능력시험</Text>
              <Text style={[colors.black, gradeStyle && gradeStyle]}>
                {' '}
                {grade}{' '}
              </Text>
              선정도서
            </TextWrap>
            <TextWrap
              style={styles.subHeader}
              font={fonts.kopubWorldDotumProMedium}>
              {grade} 선정도서를 소개합니다.
            </TextWrap>
          </View>
        )
      ) : null}
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.main}
          onPress={() => {
            dispatch(
              setTab({
                tab: 'detail',
                selectedBook: item.type === 'kbs' ? item.bookCd : item.book_cd,
                viewType: item.type,
              }),
            );
            navigate(routes.homeDetail, {
              type: 'detail',
            });
          }}>
          <View style={styles.mainContent}>
            <BookMainCarouselImage
              item={item}
              style={styles.thumbnail}
              marginHorizontal={0}
            />
            <View style={styles.info}>
              <TextWrap
                ellipsizeMode="tail"
                numberOfLines={1}
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}>
                {item.type === 'kbs' ? item.bookNm : item.book_nm}
              </TextWrap>
              <TextWrap
                style={styles.title}
                font={fonts.kopubWorldDotumProLight}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {item.writer}
              </TextWrap>
              <TextWrap
                ellipsizeMode="tail"
                font={fonts.kopubWorldDotumProLight}
                numberOfLines={1}
                style={styles.title}>
                "{item.topic}"
              </TextWrap>

              <TextWrap
                style={[styles.title, styles.date]}
                font={fonts.kopubWorldDotumProMedium}>
                {numFormat(item?.buy_price)}원
              </TextWrap>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              //
            }}>
            <Image style={styles.button1} source={images.like} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              //
            }}>
            <Image style={styles.button2} source={images.talk} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    width: screenWidth,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  main: {
    flex: 2.5,
    width: widthPercentage(252),
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    marginTop: 5,
    fontWeight: '700',
  },
  title: {
    color: colors.black,
    marginVertical: 1.5,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(17),
  },
  divider: {
    marginHorizontal: 16,
    borderWidth: 0.3,
    borderColor: '#ccc',
  },
  thumbnail: {
    height: heightPercentage(120),
    width: widthPercentage(90),
    resizeMode: 'cover',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
      },
      android: {
        backgroundColor: 'white',
        elevation: 5,
      },
    }),
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    padding: 0,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  button1: {
    width: 40,
    height: 40,
    flex: 1,
    resizeMode: 'contain',
    marginRight: 10,
  },
  button2: {
    width: 40,
    height: 40,
    flex: 1,
    resizeMode: 'contain',
  },
  headerContainer: {
    marginVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(18),
    color: colors.black,
    // fontWeight: '700',
  },
  subHeader: {
    color: colors.black,
    fontSize: fontPercentage(13),
    marginTop: 10,
  },
  cardHeaderTitle: {
    color: colors.black,
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(18),
  },
  blueText: {
    color: colors.blue,
  },
});
