import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import moment from 'moment-timezone';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import images from '../../../libs/images';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import routes from '../../../libs/routes';
import fonts from '../../../libs/fonts';
import {navigationRef, navigate} from '../../../services/navigation';
import {
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../../services/util';
import FastImage from 'react-native-fast-image';

import TextWrap from '../../../components/text-wrap/TextWrap';
import CardWrap from '../../../components/card-wrap/CardWrap';
import {setTab} from '../../../redux/tab/TabAction';
import BookMainCarouselImage from './BookMainCarouselImage';

export default function BookMainCarousel({
  name,
  grade,
  gradeStyle,
  sliderWidth,
  itemWidth,
  renderData,
  pagination,
  header,
  th,
}) {
  const dispatch = useDispatch();
  const [activeSlide, setActiveSlide] = useState(0);
  const isCarouselRef = useRef(null); //banner

  const getRenderItem = renderName => {
    switch (renderName) {
      case 'banner':
        const bannerRenderItem = ({item, index}) => {
          if (item) {
            return (
              <TouchableWithoutFeedback>
                <View style={styles.bannerContainer} key={index}>
                  <FastImage
                    style={styles.banner}
                    source={item.title}
                    resizeMode={FastImage.resizeMode.stretch}
                    onError={() => (item.title = 'bookDefault.gif')}
                    // 배너 이미지 가져오기 해야함
                  />
                </View>
              </TouchableWithoutFeedback>
            );
          } else {
            return;
          }
        };
        return bannerRenderItem;
      case 'new':
        const newRenderItem = ({item, index}) => {
          if (item) {
            return (
              <CardWrap
                style={styles.card}
                key={index}
                onPress={() => {
                  dispatch(setTab({tab: 'detail', selectedBook: item.book_cd}));
                  navigate(routes.homeDetail, {
                    type: 'detail',
                  });
                }}>
                <BookMainCarouselImage
                  item={item}
                  index={index}
                  marginHorizontal={5}
                />
                <TextWrap
                  style={styles.info}
                  ellipsizeMode="tail"
                  font={fonts.kopubWorldDotumProBold}
                  numberOfLines={2}>
                  {item.writer}/{'\n'}
                  {item.book_nm}
                </TextWrap>
              </CardWrap>
            );
          } else {
            return;
          }
        };
        return newRenderItem;
      case 'kbs':
        const kbsRenderItem = ({item, index}) => {
          if (item) {
            return (
              <CardWrap
                style={styles.card}
                key={index}
                onPress={() => {
                  dispatch(setTab({tab: 'detail', selectedBook: item.book_cd}));
                  navigate(routes.homeDetail, {
                    type: 'detail',
                  });
                }}>
                <BookMainCarouselImage
                  item={item}
                  index={index}
                  marginHorizontal={5}
                />
                <TextWrap
                  style={styles.info}
                  ellipsizeMode="tail"
                  font={fonts.kopubWorldDotumProBold}
                  numberOfLines={2}>
                  {item.writer}/{'\n'}
                  {item.book_nm}
                </TextWrap>
              </CardWrap>
            );
          } else {
            return;
          }
        };
        return kbsRenderItem;
    }
  };
  const memoRenderData = useMemo(() => renderData, []);
  const memoRenderItem = useMemo(() => getRenderItem(name), []);
  const onSnapToItem = useCallback(index => {
    setActiveSlide(index);
  }, []);

  return (
    <View style={styles.root}>
      {header &&
        (name === 'new' ? (
          <View>
            <View style={styles.cardHeader}>
              <TextWrap
                style={styles.cardHeaderTitleSt1}
                font={fonts.kopubWorldDotumProBold}>
                신간을 확인해보세요!
              </TextWrap>
              <TextWrap
                style={styles.cardHeaderSpreadSt1}
                font={fonts.kopubWorldDotumProMedium}
                onPress={() => {
                  dispatch(
                    setTab({
                      tab: 'list',
                      th: th,
                      grade: null,
                      gradeStyle:
                        grade === null
                          ? null
                          : grade === '1급'
                          ? {color: colors.st1}
                          : grade === '2급'
                          ? {color: colors.st2}
                          : grade === '(준)3급'
                          ? {color: colors.st3}
                          : grade === '(준)4급'
                          ? {color: colors.st4}
                          : grade === '(준)5급'
                          ? {color: colors.st5}
                          : grade === '누리급'
                          ? {color: colors.st6}
                          : null,
                    }),
                  );
                  navigate(routes.homeList, {
                    grade: null,
                    type: 'list',
                  });
                }}>
                &gt; 전체보기
              </TextWrap>
            </View>
          </View>
        ) : (
          <View style={styles.category}>
            <View style={styles.cardHeader}>
              <TextWrap
                style={styles.cardHeaderTitle}
                font={fonts.kopubWorldDotumProBold}>
                {moment().format('YYYY')}년도 [제{th}회]{'\n'}
                <Text
                  style={styles.blueText}
                  font={fonts.kopubWorldDotumProBold}>
                  책과함께, KBS한국어능력시험
                </Text>
                <Text
                  style={[colors.black, gradeStyle && gradeStyle]}
                  font={fonts.kopubWorldDotumProBold}>
                  {' '}
                  {grade}{' '}
                </Text>
                도서
              </TextWrap>
              <TextWrap
                style={styles.cardHeaderSpread}
                font={fonts.kopubWorldDotumProMedium}
                onPress={() => {
                  dispatch(
                    setTab({
                      tab: 'list',
                      th: th,
                      grade: grade,
                      gradeStyle:
                        grade === null
                          ? null
                          : grade === '1급'
                          ? {color: colors.st1}
                          : grade === '2급'
                          ? {color: colors.st2}
                          : grade === '(준)3급'
                          ? {color: colors.st3}
                          : grade === '(준)4급'
                          ? {color: colors.st4}
                          : grade === '(준)5급'
                          ? {color: colors.st5}
                          : grade === '누리급'
                          ? {color: colors.st6}
                          : null,
                    }),
                  );
                  navigate(routes.homeList, {
                    grade: grade,
                    type: 'list',
                  });
                }}>
                &gt; 전체보기
              </TextWrap>
            </View>
          </View>
        ))}
      <View>
        <Carousel
          ref={isCarouselRef}
          enableSnap={true}
          removeClippedSubviews={false}
          layout={'default'}
          data={memoRenderData}
          extraData={memoRenderData}
          renderItem={memoRenderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          onSnapToItem={name === 'banner' ? onSnapToItem : null}
          autoplay={name === 'banner' ? true : false}
          loop={name === 'banner' ? true : false}
          autoplayInterval={name === 'banner' ? 3000 : undefined}
        />
      </View>
      {pagination && (
        <View>
          <Pagination
            dotsLength={memoRenderData.length ? renderData.length : 0}
            carouselRef={isCarouselRef}
            activeDotIndex={activeSlide}
            containerStyle={{
              backgroundColor: 'transparent',
              paddingVertical: 0,
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 1,
              backgroundColor: '#666',
              position: 'relative',
              top: -25,
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  banner: {
    // backgroundColor: colors.red,
    height: heightPercentage(150),
    marginHorizontal: 5,
  },
  bannerContainer: {
    marginTop: 20,
  },
  category: {
    marginTop: 15,
  },
  card: {
    // backgroundColor: 'red',
    textAlign: 'center',
    height: heightPercentage(190),
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginHorizontal: 5,
  },
  cardHeaderTitle: {
    lineHeight: fontPercentage(17),
  },
  cardHeaderTitleSt1: {
    lineHeight: fontPercentage(24),
  },
  cardHeaderSpread: {
    fontSize: fontPercentage(11),
    position: 'absolute',
    bottom: 2,
    right: 0,
  },
  cardHeaderSpreadSt1: {
    fontSize: fontPercentage(11),
    position: 'absolute',
    bottom: 2,
    right: 0,
  },
  info: {
    width: '95%',
    height: '100%',
    fontSize: fontPercentage(14),
    paddingTop: 15,
    marginHorizontal: 5,
    lineHeight: 16,
  },
  blueText: {
    color: colors.blue,
  },
});
