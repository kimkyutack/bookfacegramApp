import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import TextWrap from '../../components/text-wrap/TextWrap';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import CardWrap from '../../components/card-wrap/CardWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import colors from '../../libs/colors';
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import Footer from '../../libs/footer';
import {
  dialogError,
  dialogOpenDrawerSelect,
  dialogOpenAction,
  dialogClose,
} from '../../redux/dialog/DialogActions';
import {setTab} from '../../redux/tab/TabAction';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  chunk,
} from '../../services/util';
import {requestGet, requestDelete, requestPost} from '../../services/network';

export default function BookDrawerDetail({route, navigation}) {
  const dispatch = useDispatch();
  const [editActive, setEditActive] = useState(false);
  const [selectedArr, setSelectedArr] = useState([]);

  const [loading, setLoading] = useState(true);
  const [drawerData, setDrawerData] = useState([]);
  const [drawerList, setDrawerList] = useState([]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      setLoading(true);
      requestGet({
        url: consts.apiUrl + '/mypage/bookDrawer',
      })
        .then(res => {
          if (res.status === 'SUCCESS') {
            setDrawerData(
              res.data?.find(x => x.drawIdx === route.params.drawIdx),
            );
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
      setEditActive(false);
      setSelectedArr([]);
      mount = false;
    };
  }, [route.params?.timeKey]);

  const renderItem = ({item, index}) => {
    const itemWidth = (widthPercentage(332) / 3).toFixed(1) * 1 - 10;
    if (item?.length === 1) {
      item.push({}, {});
    } else if (item?.length === 2) {
      item.push({});
    }
    if (item) {
      return (
        <View
          key={index.toString()}
          style={[
            {
              width: widthPercentage(344),
              justifyContent: 'space-between',
              flexDirection: 'row',
            },
            editActive && {marginLeft: 9},
          ]}>
          {item?.map((item1, index1) => {
            return (
              <CardWrap
                style={[styles.card, itemWidth && {width: itemWidth}]}
                key={index1.toString()}
                onPress={() => {
                  if (!item1?.bookIdx) {
                    return;
                  }
                  if (editActive) {
                    const idx = selectedArr.indexOf(item1.contentsIdx);
                    if (idx !== -1) {
                      const tmpArr = selectedArr.filter(function (item2) {
                        return item2 !== item1.contentsIdx;
                      });
                      setSelectedArr(tmpArr);
                    } else {
                      setSelectedArr([...selectedArr, item1.contentsIdx]);
                    }
                  } else {
                    dispatch(
                      setTab({
                        tab: 'detail',
                        selectedBook: item1.bookIdx,
                        viewType: item1.type,
                      }),
                    );
                    navigation.navigate(routes.homeDetail, {
                      type: 'detail',
                    });
                  }
                }}>
                <View style={{width: itemWidth}}>
                  {editActive &&
                    item1?.contentsIdx &&
                    (selectedArr.indexOf(item1?.contentsIdx) !== -1 ? (
                      <Image
                        source={images.drawerCheckActive}
                        style={styles.drawerCheckActiveButton}
                      />
                    ) : (
                      <Image
                        source={images.drawerCheckInActive}
                        style={styles.drawerCheckActiveButton}
                      />
                    ))}
                  {item1?.contentsIdx ? (
                    <FastImage
                      source={
                        item1?.type === 'kbs'
                          ? {
                              uri:
                                item1?.imgNm !== '' &&
                                item1?.imgNm !== undefined &&
                                item1?.imgNm !== 'bookDefault'
                                  ? consts.toapingUrl +
                                    '/book/book_img/' +
                                    item1?.imgNm +
                                    '.gif'
                                  : consts.imgUrl +
                                    '/thumbnail/bookDefault.gif',
                            }
                          : {
                              uri:
                                item1?.imgNm !== '' &&
                                item1?.imgNm !== undefined
                                  ? consts.imgUrl +
                                    '/thumbnail/' +
                                    item1?.imgNm +
                                    '.gif'
                                  : consts.imgUrl +
                                    '/thumbnail/bookDefault.gif',
                            }
                      }
                      resizeMode="cover"
                      style={styles.image}
                    />
                  ) : (
                    <></>
                  )}
                  <TextWrap
                    style={styles.info}
                    ellipsizeMode="tail"
                    font={fonts.kopubWorldDotumProBold}
                    numberOfLines={2}>
                    {item1?.writer?.substring(0, 9)}
                    {item1?.writer && '/'}
                    {'\n'}
                    {item1?.bookNm}
                  </TextWrap>
                </View>
              </CardWrap>
            );
          })}
        </View>
      );
    } else {
      return;
    }
  };

  const keyExtractor = useCallback((item, index) => {
    return index.toString();
  }, []);

  const editButtonPress = () => {
    setEditActive(!editActive);
  };

  const openDrawerDialog = () => {
    if (selectedArr.length === 0) {
      dispatch(dialogError('최소 하나의 책을 선택해주세요.'));
    } else {
      dispatch(
        dialogOpenDrawerSelect({
          drawerList: drawerList,
          title: '이동 책서랍 선택',
          selectedArr: selectedArr,
          currentDrawerIndex: route.params?.drawIdx,
          from: 'drawer',
        }),
      );
    }
  };

  const deleteSelectContents = () => {
    if (selectedArr.length === 0) {
      dispatch(dialogError('최소 하나의 책을 선택해주세요.'));
    } else {
      dispatch(
        dialogOpenAction({
          titleColor: '#2699fb',
          cancelTitle: '취소',
          title: '삭제',
          message: '선택한 책을 삭제하시겠습니까?',
          onPress: a => {
            if (a) {
              requestDelete({
                url: consts.apiUrl + '/mypage/bookDrawer/content',
                query: {
                  contentsIdx: selectedArr,
                },
              })
                .then(res => {
                  if (res.status === 'SUCCESS') {
                    navigation.navigate(routes.bookDrawerDetail, {
                      timeKey: Date.now(),
                    });
                  } else if (res.status === 'FAIL') {
                    // error 일때 해야함
                    dispatch(dialogError('fail'));
                  } else {
                    dispatch(dialogError('fail'));
                  }
                })
                .catch(error => {
                  // error 일때 해야함
                  dispatch(dialogError(error));
                });
            }
          },
        }),
      );
    }
  };

  return (
    <RootLayout
      topbar={{
        title: route.params?.name ? route.params?.name : '책서랍',
        navigation: navigation,
        back: true,
        options: {
          component: drawerData?.bookCnt !== 0 && (
            <ButtonWrap
              onPress={editButtonPress}
              styleTitle={
                editActive ? styles.buttonTitle : styles.activeButtonTitle
              }
              style={editActive ? styles.button : styles.activeButton}>
              {editActive ? '나중에 정리하기' : '책서랍 정리하기'}
            </ButtonWrap>
          ),
          name: 'bookDrawerCleanButton',
        },
      }}>
      {loading ? (
        <View style={[styles.root, {justifyContent: 'center'}]}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <View style={styles.root}>
          {drawerData?.bookCnt === 0 ? (
            <View style={styles.emptyRoot}>
              <Image
                source={images.bookDrawerDefault}
                style={styles.emptyIcon}
              />
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.emptyTitle}>
                보관중인 책이 없습니다
              </TextWrap>
              <TextWrap
                font={fonts.kopubWorldDotumProLight}
                style={styles.emptySubTitle}>
                도서별 하트 또는 책서랍 아이콘을 눌러{'\n'}자신만의 책서랍을
                완성해보세요!
              </TextWrap>
              <ButtonWrap
                style={styles.input}
                onPress={() => {
                  navigation.navigate(routes.home, {
                    screen: routes.topMyBooks,
                    params: {
                      type: 'main',
                      key: Date.now(),
                    },
                  });
                }}>
                <TextWrap
                  style={styles.inputTitle}
                  font={fonts.kopubWorldDotumProMedium}>
                  나만의 추천도서 보러가기
                </TextWrap>
              </ButtonWrap>
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'column',
              }}>
              <FlatList
                data={
                  drawerData?.bookDrawerContents
                    ? chunk(drawerData?.bookDrawerContents, 3)
                    : []
                }
                extraData={
                  drawerData?.bookDrawerContents
                    ? chunk(drawerData?.bookDrawerContents, 3)
                    : []
                }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
                ListHeaderComponent={() => {
                  return (
                    <View
                      style={[
                        styles.headerContainer,
                        editActive && {marginLeft: 9},
                      ]}>
                      <TextWrap
                        style={styles.header}
                        font={fonts.kopubWorldDotumProMedium}>
                        보관중인 책{' '}
                        {drawerData?.bookCnt ? drawerData?.bookCnt : 0}권
                      </TextWrap>
                    </View>
                  );
                }}
                renderItem={renderItem}
              />
              {editActive && (
                <View style={styles.bottomTooltip}>
                  <TouchableOpacity
                    style={styles.drawerSettingContainer}
                    onPress={openDrawerDialog}>
                    <Image
                      source={images.drawerMove}
                      style={styles.drawerSettingButton}
                    />
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.drawerText}>
                      책서랍 이동
                    </TextWrap>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.drawerSettingContainer}
                    onPress={deleteSelectContents}>
                    <Image
                      source={images.drawerDelete}
                      style={styles.drawerSettingButton}
                    />
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.drawerText}>
                      도서 삭제
                    </TextWrap>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      )}
      <Footer page="draw" />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyRoot: {
    marginTop: heightPercentage(152),
    alignItems: 'center',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  emptyIcon: {
    width: widthPercentage(84.6),
    height: heightPercentage(68.5),
    resizeMode: 'cover',
    marginBottom: heightPercentage(27.5),
  },
  button: {
    borderRadius: 25,
    paddingHorizontal: 13,
    height: heightPercentage(25),
    top: 2,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  buttonTitle: {
    color: colors.white,
    fontSize: fontPercentage(15),
  },
  activeButton: {
    borderRadius: 25,
    borderColor: colors.black,
    borderWidth: 1,
    paddingHorizontal: 13,
    height: heightPercentage(25),
    top: 2,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  activeButtonTitle: {
    color: colors.black,
    fontSize: fontPercentage(15),
  },
  bookShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
      },
      android: {
        backgroundColor: 'white',
        elevation: 1,
      },
    }),
  },
  card: {
    flex: 1,
    alignItems: 'center',
    width: widthPercentage(100),
    height: heightPercentage(180),
    marginBottom: heightPercentage(17),
  },
  info: {
    width: '95%',
    fontSize: fontPercentage(12),
    marginTop: heightPercentage(7),
    lineHeight: fontPercentage(16),
  },
  image: {
    borderRadius: 5,
    backgroundColor: '#eeeeee',
    height: heightPercentage(140),
  },
  headerContainer: {
    paddingLeft: 8,
    marginBottom: heightPercentage(20),
  },
  header: {
    fontSize: fontPercentage(14),
    color: '#848484',
  },
  input: {
    justifyContent: 'center',
    backgroundColor: '#0066ff',
    width: widthPercentage(250),
    height: heightPercentage(40),
    marginTop: heightPercentage(27),
  },
  inputTitle: {
    color: colors.white,
  },
  emptyTitle: {
    fontSize: fontPercentage(14),
    marginBottom: heightPercentage(10),
    textAlign: 'center',
  },
  emptySubTitle: {
    textAlign: 'center',
    fontSize: fontPercentage(11),
  },
  drawerCheckActiveButton: {
    position: 'absolute',
    zIndex: 10,
    top: 5,
    right: 4,
    width: widthPercentage(16),
    height: widthPercentage(16),
  },
  drawerSettingContainer: {
    alignItems: 'center',
  },
  drawerSettingButton: {
    width: widthPercentage(18),
    height: widthPercentage(18),
  },
  drawerText: {
    fontSize: fontPercentage(11),
    color: colors.white,
  },
  bottomTooltip: {
    height: heightPercentage(55),
    width: widthPercentage(360),
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0066ff',
    flexDirection: 'row',
  },
});
