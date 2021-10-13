import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Platform,
  Keyboard,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import colors from '../../libs/colors';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import {
  dialogError,
  dialogClose,
  dialogOpenSelect,
  dialogOpenDrawerKeyBoard,
} from '../../redux/dialog/DialogActions';
import {
  cameraItem,
  widthPercentage,
  heightPercentage,
  fontPercentage,
  screenWidth,
} from '../../services/util';
import {requestGet, requestPost} from '../../services/network';
import EditToolTip from './editTooltip';
import {useIsFocused} from '@react-navigation/core';

export default function BookDrawer({route, navigation}) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [drawerData, setDrawerData] = useState([]);
  const [drawerList, setDrawerList] = useState([]);

  useEffect(() => {
    let mount = true;
    if (mount && isFocused) {
      setLoading(true);
      requestGet({
        url: consts.apiUrl + '/mypage/bookDrawer',
      })
        .then(res => {
          if (res.status === 'SUCCESS') {
            setDrawerData(res.data);
            setDrawerList(
              res.data?.map(x => [{name: x.name, contentsIdx: x.drawIdx}]),
            );
          } else if (res.status === 'FAIL') {
            // error 일때 해야함
            dispatch(dialogError('fail'));
          } else {
            dispatch(dialogError('fail'));
          }
          setLoading(false);
        })
        .catch(error => {
          // error 일때 해야함
          dispatch(dialogError(error));
          setLoading(false);
        });
    }
    return () => {
      mount = false;
    };
  }, [isFocused]);

  const onPress = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/mypage/bookDrawer',
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          setDrawerData(res.data);
          setDrawerList(
            res.data?.map(x => [{name: x.name, contentsIdx: x.drawIdx}]),
          );
        } else if (res.status === 'FAIL') {
          // error 일때 해야함
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
        setLoading(false);
      })
      .catch(error => {
        // error 일때 해야함
        dispatch(dialogError(error));
        setLoading(false);
      });
  };

  const renderItem = ({item, index}) => {
    if (item?.bookDrawerContents?.length > 0) {
      if (item?.bookDrawerContents?.length >= 4) {
        // 최신 4개
        return (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(routes.bookDrawerDetail, {
                  drawIdx: item?.drawIdx,
                  name: item?.name,
                  timeKey: Date.now(),
                });
              }}
              style={[styles.quarterImageContainer]}>
              <View style={styles.quarterImageSubContainer1}>
                <ImageBackground
                  borderTopLeftRadius={6}
                  resizeMode="cover"
                  source={
                    item.bookDrawerContents[0]?.type === 'kbs'
                      ? {
                          uri:
                            item.bookDrawerContents[0].imgNm !== '' &&
                            item.bookDrawerContents[0].imgNm !== undefined &&
                            item.bookDrawerContents[0].imgNm !== 'bookDefault'
                              ? consts.toapingUrl +
                                '/book/book_img/' +
                                item.bookDrawerContents[0].imgNm +
                                '.gif'
                              : consts.imgUrl + '/thumbnail/bookDefault.gif',
                        }
                      : {
                          uri:
                            item.bookDrawerContents[0].imgNm !== '' &&
                            item.bookDrawerContents[0].imgNm !== undefined
                              ? consts.imgUrl +
                                '/thumbnail/' +
                                item.bookDrawerContents[0].imgNm +
                                '.gif'
                              : consts.imgUrl + '/thumbnail/bookDefault.gif',
                        }
                  }
                  style={styles.quarterImage1}
                />
                <ImageBackground
                  borderTopRightRadius={6}
                  source={
                    item.bookDrawerContents[1]?.type === 'kbs'
                      ? {
                          uri:
                            item.bookDrawerContents[1].imgNm !== '' &&
                            item.bookDrawerContents[1].imgNm !== undefined &&
                            item.bookDrawerContents[1].imgNm !== 'bookDefault'
                              ? consts.toapingUrl +
                                '/book/book_img/' +
                                item.bookDrawerContents[1].imgNm +
                                '.gif'
                              : consts.imgUrl + '/thumbnail/bookDefault.gif',
                        }
                      : {
                          uri:
                            item.bookDrawerContents[1].imgNm !== '' &&
                            item.bookDrawerContents[1].imgNm !== undefined
                              ? consts.imgUrl +
                                '/thumbnail/' +
                                item.bookDrawerContents[1].imgNm +
                                '.gif'
                              : consts.imgUrl + '/thumbnail/bookDefault.gif',
                        }
                  }
                  resizeMode="cover"
                  style={styles.quarterImage2}
                />
              </View>
              <View style={styles.quarterImageSubContainer2}>
                <ImageBackground
                  borderBottomLeftRadius={6}
                  source={
                    item.bookDrawerContents[2]?.type === 'kbs'
                      ? {
                          uri:
                            item.bookDrawerContents[2].imgNm !== '' &&
                            item.bookDrawerContents[2].imgNm !== undefined &&
                            item.bookDrawerContents[2].imgNm !== 'bookDefault'
                              ? consts.toapingUrl +
                                '/book/book_img/' +
                                item.bookDrawerContents[2].imgNm +
                                '.gif'
                              : consts.imgUrl + '/thumbnail/bookDefault.gif',
                        }
                      : {
                          uri:
                            item.bookDrawerContents[2].imgNm !== '' &&
                            item.bookDrawerContents[2].imgNm !== undefined
                              ? consts.imgUrl +
                                '/thumbnail/' +
                                item.bookDrawerContents[2].imgNm +
                                '.gif'
                              : consts.imgUrl + '/thumbnail/bookDefault.gif',
                        }
                  }
                  resizeMode="cover"
                  style={styles.quarterImage3}
                />
                <ImageBackground
                  borderBottomRightRadius={6}
                  source={
                    item.bookDrawerContents[3]?.type === 'kbs'
                      ? {
                          uri:
                            item.bookDrawerContents[3].imgNm !== '' &&
                            item.bookDrawerContents[3].imgNm !== undefined &&
                            item.bookDrawerContents[3].imgNm !== 'bookDefault'
                              ? consts.toapingUrl +
                                '/book/book_img/' +
                                item.bookDrawerContents[3].imgNm +
                                '.gif'
                              : consts.imgUrl + '/thumbnail/bookDefault.gif',
                        }
                      : {
                          uri:
                            item.bookDrawerContents[3].imgNm !== '' &&
                            item.bookDrawerContents[3].imgNm !== undefined
                              ? consts.imgUrl +
                                '/thumbnail/' +
                                item.bookDrawerContents[3].imgNm +
                                '.gif'
                              : consts.imgUrl + '/thumbnail/bookDefault.gif',
                        }
                  }
                  resizeMode="cover"
                  style={styles.quarterImage4}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.paragraphContainer}>
              <View>
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={styles.paragraphTitle}>
                  {item?.name ? item?.name : '책서랍 이름을 지어주세요.'}
                </TextWrap>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.paragraphQuantity}>
                  보관중인 책 {item?.bookDrawerContents?.length}권
                </TextWrap>
              </View>
              {item?.name !== '기본 책서랍' && (
                <EditToolTip
                  item={item}
                  index={index}
                  length={drawerData.length}
                  onPress={onPress}
                />
              )}
            </View>
          </View>
        );
      } else {
        // 첫이미지 1개
        return (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(routes.bookDrawerDetail, {
                  drawIdx: item?.drawIdx,
                  name: item?.name,
                  timeKey: Date.now(),
                })
              }
              style={styles.imageContainer}>
              <ImageBackground
                source={
                  item.bookDrawerContents[
                    item?.bookDrawerContents?.length !== 0
                      ? item?.bookDrawerContents?.length - 1
                      : 0
                  ]?.type === 'kbs'
                    ? {
                        uri:
                          item.bookDrawerContents[
                            item?.bookDrawerContents?.length !== 0
                              ? item?.bookDrawerContents?.length - 1
                              : 0
                          ].imgNm !== '' &&
                          item.bookDrawerContents[
                            item?.bookDrawerContents?.length !== 0
                              ? item?.bookDrawerContents?.length - 1
                              : 0
                          ].imgNm !== undefined &&
                          item.bookDrawerContents[
                            item?.bookDrawerContents?.length !== 0
                              ? item?.bookDrawerContents?.length - 1
                              : 0
                          ].imgNm !== 'bookDefault'
                            ? consts.toapingUrl +
                              '/book/book_img/' +
                              item.bookDrawerContents[
                                item?.bookDrawerContents?.length !== 0
                                  ? item?.bookDrawerContents?.length - 1
                                  : 0
                              ].imgNm +
                              '.gif'
                            : consts.imgUrl + '/thumbnail/bookDefault.gif',
                      }
                    : {
                        uri:
                          item.bookDrawerContents[
                            item?.bookDrawerContents?.length !== 0
                              ? item?.bookDrawerContents?.length - 1
                              : 0
                          ].imgNm !== '' &&
                          item.bookDrawerContents[
                            item?.bookDrawerContents?.length !== 0
                              ? item?.bookDrawerContents?.length - 1
                              : 0
                          ].imgNm !== undefined
                            ? consts.imgUrl +
                              '/thumbnail/' +
                              item.bookDrawerContents[
                                item?.bookDrawerContents?.length !== 0
                                  ? item?.bookDrawerContents?.length - 1
                                  : 0
                              ].imgNm +
                              '.gif'
                            : consts.imgUrl + '/thumbnail/bookDefault.gif',
                      }
                }
                resizeMode="cover"
                imageStyle={{borderRadius: 5}}
                style={styles.fullImage}
              />
            </TouchableOpacity>
            <View style={styles.paragraphContainer}>
              <View>
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={styles.paragraphTitle}>
                  {item?.name ? item?.name : '책서랍 이름을 지어주세요.'}
                </TextWrap>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.paragraphQuantity}>
                  보관중인 책 {item?.bookDrawerContents?.length}권
                </TextWrap>
              </View>
              {item?.name !== '기본 책서랍' && (
                <EditToolTip
                  item={item}
                  index={index}
                  length={drawerData.length}
                  onPress={onPress}
                />
              )}
            </View>
          </View>
        );
      }
    } else {
      // 이미지 없을경우
      return (
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(routes.bookDrawerDetail, {
                drawIdx: item?.drawIdx,
                name: item?.name,
                timeKey: Date.now(),
              })
            }
            style={styles.imageContainer}>
            <ImageBackground
              source={images.bookDrawerDefault}
              resizeMode="cover"
              style={styles.image}
            />
          </TouchableOpacity>
          <View style={styles.paragraphContainer}>
            <View>
              <TextWrap
                font={fonts.kopubWorldDotumProBold}
                style={styles.paragraphTitle}>
                {item?.name ? item?.name : '책서랍 이름을 지어주세요.'}
              </TextWrap>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.paragraphQuantity}>
                보관중인 책 {item?.bookDrawerContents?.length}권
              </TextWrap>
            </View>
            {item?.name !== '기본 책서랍' && (
              <EditToolTip
                item={item}
                index={index}
                length={drawerData.length}
                onPress={onPress}
              />
            )}
          </View>
        </View>
      );
    }
  };

  const keyExtractor = useCallback((item, index) => {
    return index.toString();
  }, []);
  const memoizedRenderItem = useMemo(() => renderItem, [drawerList]);

  return (
    <RootLayout
      topbar={{
        title: '책서랍',
        navigation: navigation,
        back: true,
        options: {
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        },
      }}>
      {loading ? (
        <View style={[styles.root, {justifyContent: 'center'}]}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <TouchableWithoutFeedback>
          <View style={styles.root}>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(dialogClose());
                dispatch(
                  dialogOpenDrawerKeyBoard({
                    title: '새로운 책서랍 만들기',
                    buttonTitle: '완료',
                    onPress: onPress,
                    from: 'new',
                  }),
                );
              }}>
              <View style={styles.cardContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Image
                    style={styles.infoIcon}
                    source={images.bookDrawerDefault}
                  />
                  <TextWrap
                    style={styles.info}
                    ellipsizeMode="tail"
                    font={fonts.kopubWorldDotumProBold}
                    numberOfLines={2}>
                    나만의 새로운 책서랍 만들기
                  </TextWrap>
                </View>
                <TextWrap
                  style={styles.infoAdd}
                  font={fonts.kopubWorldDotumProBold}
                  numberOfLines={2}>
                  +
                </TextWrap>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.listContainer}>
              <FlatList
                numColumns={2}
                data={drawerData}
                extraData={drawerData}
                removeClippedSubviews={true}
                disableVirtualization={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor} // arrow 함수 자제
                renderItem={memoizedRenderItem} // arrow 함수 자제
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  cardContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: screenWidth - 36,
    height: heightPercentage(53),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  info: {
    marginLeft: 14,
    marginTop: 1,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(17),
  },
  infoIcon: {
    marginLeft: 15,
    width: widthPercentage(20),
    height: heightPercentage(16),
    resizeMode: 'cover',
  },
  infoAdd: {
    marginRight: 16,
    marginTop: 1,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(17),
  },
  listContainer: {
    flex: 1,
    width: screenWidth - 36,
    marginBottom: 18,
  },
  imageContainer: {
    width: widthPercentage(308.6) / 2,
    height: heightPercentage(180),
    marginRight: widthPercentage(20),
    marginTop: heightPercentage(30),
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  image: {
    width: widthPercentage(84.6),
    height: heightPercentage(68.5),
    resizeMode: 'cover',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
  },
  quarterImageContainer: {
    borderRadius: 6,
    width: widthPercentage(308.6) / 2,
    height: heightPercentage(180),
    marginRight: widthPercentage(20),
    marginTop: heightPercentage(30),
  },
  quarterImageSubContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  quarterImageSubContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  quarterImage1: {
    width: widthPercentage(76.1),
    height: heightPercentage(89),
    borderTopLeftRadius: 6,
  },
  quarterImage2: {
    width: widthPercentage(76.1),
    height: heightPercentage(89),
    borderTopRightRadius: 6,
  },
  quarterImage3: {
    marginTop: 2,
    width: widthPercentage(76.1),
    height: heightPercentage(89),
    borderBottomLeftRadius: 6,
  },
  quarterImage4: {
    marginTop: 2,
    width: widthPercentage(76.1),
    height: heightPercentage(89),
    borderBottomRightRadius: 6,
  },
  paragraphContainer: {
    marginTop: heightPercentage(12),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  paragraphTitle: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(16),
  },
  paragraphQuantity: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(18),
    color: '#848484',
  },
  input: {
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    color: colors.text,
    width: screenWidth,
    marginTop: heightPercentage(14),
    paddingLeft: widthPercentage(20),
    paddingRight: widthPercentage(28),
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
  inputContainer: {
    backgroundColor: colors.white,
    alignContent: 'center',
    alignItems: 'center',
    height: heightPercentage(206),
  },
  inputTitle: {
    fontSize: fontPercentage(14),
    color: '#707070',
    marginTop: heightPercentage(27),
  },
  inputCount: {
    position: 'absolute',
    bottom: 14,
    right: 20,
    color: colors.black,
    fontSize: fontPercentage(11),
  },
  delete: {
    width: widthPercentage(14),
    height: heightPercentage(14),
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: screenWidth,
    height: heightPercentage(55),
    backgroundColor: '#0066ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButtonContainer: {
    width: screenWidth,
    height: heightPercentage(55),
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeDisabled: {
    color: '#c6c6c6',
  },
  complete: {
    color: colors.white,
  },
  overLay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.8,
  },
});