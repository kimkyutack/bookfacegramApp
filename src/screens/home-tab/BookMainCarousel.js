import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from 'react-native';
import moment from 'moment-timezone';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import images from '../../libs/images';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {screenWidth} from '../../services/util';
import FastImage from 'react-native-fast-image';

import TextWrap from '../../components/text-wrap/TextWrap';
import CardWrap from '../../components/card-wrap/CardWrap';

import BookMainCarouselImage from './BookMainCarouselImage';
export default function BookMainCarousel({
  name,
  grade,
  gradeStyle,
  sliderWidth,
  itemWidth,
  onPressBookList,
  setTabs,
  renderData,
  setSelectedBook,
  pagination,
  header,
  th,
  isCarouselRef,
}) {
  const [activeSlide, setActiveSlide] = useState(0);

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
                    // onError={() => (item.title = 'bookDefault.gif')}
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
                  setTabs(2);
                  setSelectedBook(item.book_cd);
                }}>
                <BookMainCarouselImage item={item} index={index} />
                {/* <FastImage
                  source={{
                    uri:
                      item.img_nm !== ''
                        ? consts.imgUrl + '/' + item.img_nm + '.gif'
                        : consts.imgUrl + '/bookDefault.gif',
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.image}
                  onError={() => (item.img_nm = 'bookDefault')}
                  // onError={() => console.log(item.book_nm)}
                /> */}
                <TextWrap
                  style={styles.info}
                  ellipsizeMode="tail"
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
                  setTabs(2);
                  setSelectedBook(item.book_cd);
                }}>
                <BookMainCarouselImage item={item} index={index} />
                <TextWrap
                  style={styles.info}
                  ellipsizeMode="tail"
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
              <TextWrap style={styles.cardHeaderTitleSt1}>
                신간을 확인해보세요!
              </TextWrap>
              <TextWrap
                style={styles.cardHeaderSpread}
                onPress={() => onPressBookList(grade)}>
                &gt; 전체보기
              </TextWrap>
            </View>
          </View>
        ) : (
          <View style={styles.category}>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.cardHeaderTitle}>
                {moment().format('YYYY')}년도 [제{th}회]{'\n'}
                <TextWrap style={styles.blueText}>
                  책과함께, KBS한국어능력시험
                </TextWrap>
                <TextWrap style={[colors.black, gradeStyle && gradeStyle]}>
                  {' '}
                  {grade}{' '}
                </TextWrap>
                도서
              </TextWrap>
              <TextWrap
                style={styles.cardHeaderSpread}
                onPress={() => onPressBookList(grade)}>
                &gt; 전체보기
              </TextWrap>
            </View>
          </View>
        ))}
      <View style={name === 'banner' ? '' : styles.cardContainer}>
        <Carousel
          ref={isCarouselRef}
          lockScrollWhileSnapping={true}
          layout={'default'}
          data={memoRenderData}
          extraData={memoRenderData}
          enableSnap={true}
          renderItem={memoRenderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          onSnapToItem={name === 'banner' ? onSnapToItem : null}
          removeClippedSubviews={false}
          autoplay={name === 'banner' ? true : false}
          loop={name === 'banner' ? true : false}
          autoplayInterval={3000}
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
              backgroundColor: '#919392',
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
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  banner: {
    height: 150,
    width: '100%',
  },
  bannerContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    height: 150,
  },
  category: {
    marginTop: 15,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
    height: 204,
    width: '100%',
    maxWidth: screenWidth / 3.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    marginBottom: 6,
  },
  cardHeaderTitle: {
    fontWeight: '700',
    lineHeight: 16,
  },
  cardHeaderTitleSt1: {
    fontWeight: '700',
    lineHeight: 24,
  },
  cardHeaderSpread: {fontSize: 12, position: 'absolute', bottom: -6, right: 0},
  cardContainer: {
    height: 204,
  },
  image: {
    top: 5,
    position: 'relative',
    width: '90%',
    height: 150,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.2,
    //   },
    //   android: {
    //     backgroundColor: 'white',
    //     elevation: 5,
    //   },
    // }),
  },
  info: {
    width: '100%',
    height: '100%',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    paddingTop: 16,
    lineHeight: 16,
  },
  blueText: {
    color: colors.blue,
  },
  button: {
    justifyContent: 'center',
    width: '80%',
  },
});
