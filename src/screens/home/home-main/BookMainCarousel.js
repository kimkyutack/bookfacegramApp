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
import { requestGet } from '../../../services/network';
import TextWrap from '../../../components/text-wrap/TextWrap';
import CardWrap from '../../../components/card-wrap/CardWrap';
import { setTab } from '../../../redux/tab/TabAction';
import BookMainCarouselImage from './BookMainCarouselImage';
import { dialogError } from '../../../redux/dialog/DialogActions';

export default function BookMainCarousel({
  name,
  grade,
  gradeStyle,
  slideWidth,
  itemWidth,
  renderData,
  pagination,
  header,
  th,
}) {
  const dispatch = useDispatch();
  const [bannerindex, setBannerindex] = useState(0);
  const hello = (bookCd) => {
    dispatch(
      setTab({
        tab: 'detail',
        selectedBook: bookCd,
        viewType: 'kbs',
      }),
    );
    navigate(routes.homeDetail, {
      type: 'detail',
    });

  }
  const eventBanner = async (idx) => {
    requestGet({
      url: consts.apiUrl + '/mypage/eventDetail',
      query: {
        ev_idx: idx,
      },
    })
      .then(data => {
        if (data.status === 'SUCCESS') {
          navigate(routes.eventDetail, data);
        } else {
          dispatch({
            type: bookActionType.allFailure,
            data: `error code : ${data?.code}`,
            allPage: page,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: bookActionType.allFailure,
          data:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
          allPage: page,
        });
      });


  }
  useEffect(() => {
     let mount = true;
    if (mount) {
      setBannerindex(0);
    }
    return () => {
      mount = false;
    };
  },[]);

  const bannerRenderItem = (item, index) => {
    if (item) {
      return (
        <TouchableWithoutFeedback
          key={index}
          onPress={() => {
            item.bannerType === 'detail'
              ? hello(item.bookCd)
              : item.bannerType === 'event'
                ? eventBanner(item.idx)
                : item.bannerType === 'notice'
                  ? navigate(routes.notice, { idx: item.idx })
                  : (dispatch(dialogError({ message: item.bannerType })));
          }}>
          <View style={styles.bannerContainer}>
            <FastImage
              source={{
                uri: consts.bannerUrl + '/banner/' + item.bannerImageName,
              }}
              resizeMode={FastImage.resizeMode.stretch}
              style={styles.banner}
              //onPress={() => Linking.openURL(item?.bannerLink)}
              onError={() => (item.title = 'bookDefault.gif')}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return;
    }
  };

  const newRenderItem = (item, index) => {
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
            item1.type = 'new';
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
                key={item1.book_cd + index1.toString()}
                onPress={() => {
                  dispatch(
                    setTab({
                      tab: 'detail',
                      selectedBook: item1?.book_cd,
                      viewType: 'new',
                    }),
                  );
                  navigate(routes.homeDetail, {
                    type: 'detail',
                  });
                }}>
                {item1?.book_cd && (
                  <View style={{ width: itemWidth }}>
                    <BookMainCarouselImage
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
                      {item1?.book_nm}
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

  const kbsRenderItem = (item, index) => {
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
            item1.type = 'kbs';
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
                key={item1.bookCd + index1.toString()}
                onPress={() => {
                  dispatch(
                    setTab({
                      tab: 'detail',
                      selectedBook: item1?.bookCd,
                      viewType: 'kbs',
                    }),
                  );
                  navigate(routes.homeDetail, {
                    type: 'detail',
                  });
                }}>
                {item1?.bookCd && (
                  <View style={{ width: itemWidth }}>
                    <BookMainCarouselImage
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
                      {item1?.bookNm}
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

  return (
    <View style={styles.root}>
      {header &&
        (name === 'new' ? (
          <View>
            <View style={styles.cardHeader}>
              <TextWrap
                style={styles.cardHeaderTitleSt1}
                font={fonts.kopubWorldDotumProBold}>
                ????????? ??????????????????!
              </TextWrap>
              <TextWrap
                style={styles.cardHeaderSpreadSt1}
                font={fonts.kopubWorldDotumProMedium}
                onPress={() => {
                  dispatch(
                    setTab({
                      tab: 'list',
                      grade: null,
                      gradeStyle:
                        grade === null
                          ? null
                          : grade === '1???'
                            ? { color: colors.st1 }
                            : grade === '2???'
                              ? { color: colors.st2 }
                              : grade === '3???'
                                ? { color: colors.st3 }
                                : grade === '4???'
                                  ? { color: colors.st4 }
                                  : grade === '5???'
                                    ? { color: colors.st5 }
                                    : grade === '???3???'
                                      ? { color: colors.st3 }
                                      : grade === '???4???'
                                        ? { color: colors.st4 }
                                        : grade === '???5???'
                                          ? { color: colors.st5 }
                                          : grade === '?????????'
                                            ? { color: colors.st6 }
                                            : null,
                    }),
                  );

                  navigate(routes.homeList, {
                    screen: routes.topNewBooks,
                    params: {
                      grade: null,
                      type: 'list',
                      key: Date.now(),
                      bookType: 'new'
                    },
                  });

                }}>
                &gt; ????????????
              </TextWrap>
            </View>
          </View>
        ) : (
          grade && (
            <View style={styles.category}>
              <View style={styles.cardHeader}>
                <TextWrap
                  style={styles.cardHeaderTitle}
                  font={fonts.kopubWorldDotumProBold}>
                  {moment().format('YYYY')}?????? [???{th}???]{'\n'}
                  <Text
                    style={styles.blueText}
                    font={fonts.kopubWorldDotumProBold}>
                    ????????????, KBS?????????????????????
                  </Text>
                  <Text
                    style={[colors.black, gradeStyle && gradeStyle]}
                    font={fonts.kopubWorldDotumProBold}>
                    {' '}
                    {grade}{' '}
                  </Text>
                  ??????
                </TextWrap>
                <TextWrap
                  style={styles.cardHeaderSpread}
                  font={fonts.kopubWorldDotumProMedium}
                  onPress={() => {
                    dispatch(
                      setTab({
                        tab: 'list',
                        grade: grade,
                        gradeStyle:
                          grade === null
                            ? null
                            : grade === '1???'
                              ? { color: colors.st1 }
                              : grade === '2???'
                                ? { color: colors.st2 }
                                : grade === '3???'
                                  ? { color: colors.st3 }
                                  : grade === '4???'
                                    ? { color: colors.st4 }
                                    : grade === '5???'
                                      ? { color: colors.st5 }
                                      : grade === '???3???'
                                        ? { color: colors.st3 }
                                        : grade === '???4???'
                                          ? { color: colors.st4 }
                                          : grade === '???5???'
                                            ? { color: colors.st5 }
                                            : grade === '?????????'
                                              ? { color: colors.st6 }
                                              : null,
                      }),
                    );
                    navigate(routes.homeList, {
                      screen: routes.topNewBooks,
                      params: {
                        grade: grade,
                        type: 'list',
                        key: Date.now(),
                        bookType: 'kbs'
                      },
                    });
                    // navigate(routes.home, {
                    //   screen: routes.topNewBooks,
                    //   params: {
                    //     grade: grade,
                    //     type: 'list',
                    //     key: Date.now(),
                    //   },
                    // });
                  }}>
                  &gt; ????????????
                </TextWrap>
              </View>
            </View>
          )
        ))}
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        width={name === 'banner' ? screenWidth : slideWidth}
        height={
          name === 'banner' ? heightPercentage(165) : heightPercentage(190)
        }
        showsPagination={pagination}
        removeClippedSubviews={false}
        loop={name === 'banner' ? true : false}
        autoplay={name === 'banner' ? true : false}
        autoplayTimeout={3}
        pagingEnabled={name === 'banner' ? true : false}
        dotStyle={{ top: 15 }}
        onIndexChanged={(index) => {
                  name === 'banner' && setBannerindex(index);
                }}
        index={name === 'banner' ? bannerindex : 0}
        dotColor={colors.border}
        activeDotStyle={{ top: 15 }}
        activeDotColor={colors.blue}
        nextButton={<Text />}
        prevButton={<Text />}>
        {renderData?.map((data, index) => {
          if (name === 'banner') {
            return bannerRenderItem(data, index);
          } else if (name === 'new') {
            return newRenderItem(data, index);
          } else if (name === 'kbs') {
            return kbsRenderItem(data, index);
          } else {
            return <></>;
          }
        })}
      </Swiper>
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
  wrapper: {},
  banner: {
    width: widthPercentage(332),
    height: heightPercentage(150),
  },
  bannerContainer: {
    alignSelf: 'center',
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
    justifyContent: 'space-between',
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
    fontSize: fontPercentage(12),
    marginTop: heightPercentage(5),
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
