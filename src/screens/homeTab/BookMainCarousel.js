import React, {useState, useEffect, useRef, useCallback} from 'react';
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
import images from '../../libs/image';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {screenWidth} from '../../services/util';
import FastImage from 'react-native-fast-image';

import TextWrap from '../../components/text-wrap/TextWrap';
import CardWrap from '../../components/card-wrap/CardWrap';

const BookMainCarousel = ({
  name,
  grade,
  gradeStyle,
  sliderWidth,
  itemWidth,
  onPressBookList,
  setTabs,
  renderData,
  setSelectedBook,
  bannerPagination,
  header,
  th,
}) => {
  const isCarousel = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  let renderItem = [];
  switch (name) {
    case 'banner':
      const bannerRenderItem = ({item, index}) => {
        return (
          <TouchableWithoutFeedback>
            <View style={styles.bannerContainer} key={index}>
              <FastImage
                style={styles.banner}
                source={item.title}
                resizeMode={FastImage.resizeMode.stretch}
                // onError={() => (item.title = 'bookDefault.png')}
                // 배너 이미지 가져오기 해야함
              />
            </View>
          </TouchableWithoutFeedback>
        );
      };
      renderItem = bannerRenderItem;
      break;
    case 'new':
      const newRenderItem = ({item, index}) => {
        return (
          <CardWrap
            style={styles.card}
            onPress={() => {
              setTabs(2);
              setSelectedBook(item.book_cd);
            }}>
            <FastImage
              source={{
                uri: consts.imgUrl + '/' + item.img_nm,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.image}
              onError={() => (item.img_nm = 'bookDefault.png')}
            />
            <TextWrap
              style={styles.info}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {item.writer}/{'\n'}
              {item.book_nm}
            </TextWrap>
          </CardWrap>
        );
      };
      renderItem = newRenderItem;
      break;
    case 'kbs':
      const kbsRenderItem = ({item, index}) => {
        return (
          <CardWrap
            style={styles.card}
            onPress={() => {
              setTabs(2);
              setSelectedBook(item.book_cd);
            }}>
            <FastImage
              source={{
                uri: consts.imgUrl + '/' + item.img_nm,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.image}
              onError={() => (item.img_nm = 'bookDefault.png')}
            />
            <TextWrap
              style={styles.info}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {item.writer}/{'\n'}
              {item.book_nm}
            </TextWrap>
          </CardWrap>
        );
      };
      renderItem = kbsRenderItem;
      break;
  }
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
          removeClippedSubviews={true}
          lockScrollWhileSnapping={true}
          ref={isCarousel}
          layout={'default'}
          data={renderData ? renderData : []}
          extraData={renderData ? renderData : []}
          enableSnap={true}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          onSnapToItem={name === 'banner' ? onSnapToItem : null}
          autoplay={true}
          loop={true}
          autoplayInterval={3000}
        />
      </View>
      {bannerPagination && (
        <View>
          <Pagination
            dotsLength={renderData ? renderData.length : 0}
            carouselRef={isCarousel}
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
};

export default React.memo(BookMainCarousel);

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
