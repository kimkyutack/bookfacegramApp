import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Linking,
} from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import Swiper from 'react-native-swiper';

import images from '../../../libs/images';
import colors from '../../../libs/colors';
import consts from '../../../libs/consts';
import routes from '../../../libs/routes';
import fonts from '../../../libs/fonts';
import { navigationRef, navigate } from '../../../services/navigation';
import {
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../../services/util';
import FastImage from 'react-native-fast-image';

import TextWrap from '../../../components/text-wrap/TextWrap';
import CardWrap from '../../../components/card-wrap/CardWrap';
import { setTab } from '../../../redux/tab/TabAction';
import MyBookListImage from './MyBookListImage';
import { dialogError } from '../../../redux/dialog/DialogActions';

export default function MyBookCarousel({
  name,
  grade,
  gradeStyle,
  slideWidth,
  itemWidth,
  renderData1,
  renderData2,
  pagination,
  header,
  th,
}) {
  //console.log('ddddd' , renderData2.slice(1,12))
  const ref1 = useRef();
  const ref2 = useRef();
  const dispatch = useDispatch();
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {

    if (ref1.current !== undefined) {
      ref1.current.scrollTo(0, true);
    }
    if (ref2.current !== undefined) {
      ref2.current.scrollTo(0, true);
    }
  }, [name]);
  const slideTo = (index) => {
    if (swiper)
      swiper.slideTo(index)
  };

  const newRenderItem = (item, index) => {
    //console.log(item)
    if (item?.length === 1) {
      item.push([], []);
    } else if (item?.length === 2) {
      item.push([]);
    }
    if (item) {
      return (
        <View
          key={index.toString()}
          style={{
            width: slideWidth,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          {item?.map((item1, index1) => {
            return (
              <CardWrap
                style={[
                  styles.card,
                  itemWidth && { width: itemWidth },
                  // index1 === 2
                  //   ? {alignItems: 'flex-end'}
                  //   : index1 === 0
                  //   ? {alignItems: 'flex-start'}
                  //   : {alignItems: 'center'},
                ]}
                key={item1.bookIdx + index1.toString()}
                onPress={() => {
                  dispatch(
                    setTab({
                      tab: 'detail',
                      selectedBook:
                      item1.bookIdx,
                      viewType: item1.type === 'app' ? 'new' : 'kbs',
                    }),
                  );
                  navigate(routes.homeDetail, {
                    type: 'detail',
                  });
                }}>
                {item1?.bookIdx && (
                  <View style={{ width: itemWidth }}>
                    <MyBookListImage
                      item={item1}
                      index={index}
                      style={[{ width: itemWidth }, styles.bookShadow]}
                    />
                    <TextWrap
                      style={styles.info}
                      ellipsizeMode="tail"
                      font={fonts.kopubWorldDotumProBold}
                      numberOfLines={2}>
                      {item1?.writer.substring(0, 9)}/{'\n'}
                      {item1?.title}
                    </TextWrap>
                  </View>
                )}
              </CardWrap>
            );
          })}
        </View>
      );
    } else {
      return;
    }
  };

  const _onMomentumScrollEnd = (e, state, context) => {
  }

  return (
    <View style={styles.root}>
      {header &&
        <View style={styles.cardHeader}>
          <TextWrap
            style={styles.cardHeaderSpread}
            font={fonts.kopubWorldDotumProMedium}
            onPress={() => {
              dispatch(
                setTab({
                  tab: 'mylist',
                  selectType: name,
                }),
              );
               navigate(routes.homeList, {
                 screen: routes.topMyBooks,
                 params: {
                   type: 'mylist',
                   key: Date.now(),
                 },
               });
            }}>
            &gt; 전체보기
          </TextWrap>
        </View>
      }
      {header &&
        <Swiper
          ref={ref1}
          showsButtons={false}
          width={slideWidth}
          height={
            heightPercentage(200)
          }
          onSwiper={setSwiper}
          index={0}
          showsPagination={pagination}
          removeClippedSubviews={false}

          loop={false}
          autoplay={false}
          autoplayTimeout={3}
          pagingEnabled={false}
          dotStyle={{ top: 15 }}
          dotColor={colors.border}
          activeDotStyle={{ top: 15 }}
          activeDotColor={colors.blue}
          nextButton={<Text />}
          prevButton={<Text />}
        // onMomentumScrollEnd={(e, state, context) =>{
        //   console.log('index:', state.index);
        // }
        // }
        >
          {renderData1?.map((data, index) => {
            return newRenderItem(data, index);
          }
          )}
        </Swiper>
      }
      {header &&
        <Swiper
          ref={ref2}
          style={styles.wrapper}
          showsButtons={false}
          width={slideWidth}
          height={
            heightPercentage(250)
          }
          onSwiper={setSwiper}
          index={0}
          showsPagination={pagination}
          removeClippedSubviews={false}
          loop={false}
          autoplay={false}
          autoplayTimeout={3}
          pagingEnabled={false}
          dotStyle={{ top: 15 }}
          dotColor={colors.border}
          activeDotStyle={{ top: 15 }}
          activeDotColor={colors.blue}
          nextButton={<Text />}
          prevButton={<Text />}
        // onMomentumScrollEnd={(e, state, context) =>
        //   console.log('index:', state.index)
        // }
        >
          {renderData2.slice(0,5)?.map((data, index) => {
            return newRenderItem(data, index);
          }
          )}
        </Swiper>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: colors.white,
  },
  wrapper: { top: 20 },
  banner: {
    width: widthPercentage(332),
    height: heightPercentage(150),
  },
  bannerContainer: {
    marginTop: heightPercentage(15),
  },
  category: {
    marginTop: 15,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    height: heightPercentage(200),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: widthPercentage(6),
    marginBottom: 12,
  },
  cardHeaderTitle: {
    lineHeight: fontPercentage(17),
    fontSize: fontPercentage(13),
  },
  cardHeaderTitleSt1: {
    lineHeight: fontPercentage(24),
    fontSize: fontPercentage(13),
  },
  cardHeaderSpread: {
    fontSize: fontPercentage(11),
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
    fontSize: fontPercentage(12),
    marginTop: heightPercentage(10),
    lineHeight: fontPercentage(16),
  },
  blueText: {
    color: colors.blue,
  },
  bookShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      },
      android: {
        backgroundColor: 'white',
        elevation: 1,
      },
    }),
  },
});
