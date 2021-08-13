import React, {useEffect, useState, useRef, memo} from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {PinchGestureHandler} from 'react-native-gesture-handler';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import Avatar from '../../components/avatar/Avatar';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  screenWidth,
  fontPercentage,
} from '../../services/util';
import TextWrap from '../../components/text-wrap/TextWrap';
import TabsIcon from '../../components/tabs-icon/TabsIcon';
import {requestGet} from '../../services/network';
import {dialogOpenSelect, dialogError} from '../../redux/dialog/DialogActions';
import FastImage from 'react-native-fast-image';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';

export default function FeedBookUser({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const dispatch = useDispatch();

  const listRef = useRef();
  const [myInfo, setMyInfo] = useState(true);
  const [limit, setLimit] = useState(32);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // 0 my 1 other
  const [numColumns, setNumColumns] = useState(3); // pinch zoom columns number

  // mock data
  const k = [
    {id: 1, uri: '1'},
    {id: 2, uri: '2'},
    {id: 3, uri: '3'},
    {id: 4, uri: '4'},
    {id: 5, uri: '5'},
    {id: 6, uri: '6'},
    {id: 7, uri: '7'},
    {id: 8, uri: '8'},
    {id: 9, uri: '9'},
    {id: 10, uri: '10'},
    {id: 11, uri: '11'},
    {id: 12, uri: '12'},
    {id: 13, uri: '13'},
    {id: 14, uri: '14'},
    {id: 15, uri: '15'},
    {id: 16, uri: '16'},
    {id: 17, uri: '17'},
    {id: 18, uri: '18'},
    {id: 19, uri: '19'},
    {id: 20, uri: '20'},
    {id: 21, uri: '21'},
    {id: 22, uri: '22'},
    {id: 23, uri: '23'},
    {id: 24, uri: '24'},
    {id: 25, uri: '25'},
    {id: 26, uri: '26'},
    {id: 27, uri: '27'},
    {id: 28, uri: '28'},
    {id: 29, uri: '29'},
    {id: 30, uri: '30'},
    {id: 31, uri: '31'},
    {id: 32, uri: '32'},
  ];
  const fetchUserData = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/users/' + user.member_id + '/friends',
      query: {
        member_id: route.params?.member_id,
        page,
        limit: limit,
      },
    })
      .then(userData => {
        if (page > 1) {
          setData(d => [...d, ...userData]);
        } else {
          setData([...userData]);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        // dispatch(dialogError(e));
        if (page > 1) {
          setData(d => [...d, ...k]);
        } else {
          setData([...k]);
        }
      });
  };

  const fetchWholeData = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/users/' + user.member_id + '/friends',
      query: {
        page,
        limit: limit,
      },
    })
      .then(userData => {
        if (page > 1) {
          setData(d => [...d, ...userData]);
        } else {
          setData([...userData]);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        // dispatch(dialogError(e));
        if (page > 1) {
          setData(d => [...d, ...k]);
        } else {
          setData([...k]);
        }
      });
  };

  useEffect(() => {
    setPage(1);
    setLimit(32);
    if (tabIndex === 0) {
      fetchUserData();
    } else {
      fetchWholeData();
    }
  }, [tabIndex]);

  useEffect(() => {
    if (tabIndex === 0) {
      fetchUserData();
    } else {
      fetchWholeData();
    }
  }, [page]);

  useEffect(() => {
    if (route.params?.member_id === user.member_id) {
      setMyInfo(true);
    } else {
      setMyInfo(false);
    }
    listRef.current?.scrollToOffset({y: 0, animated: false});
    setPage(1);
    setLimit(32);
    setTabIndex(0);
  }, [route.params?.member_id]);

  const handleGesture = e => {
    const oldScale = e.nativeEvent.scale;
    if (oldScale >= 1) {
      if (numColumns === 2) {
        return;
      }
      setNumColumns(numColumns - 1);
    } else {
      if (numColumns >= 4) {
        return;
      }
      setNumColumns(numColumns + 1);
    }
  };

  const onEndReached = e => {
    if (!loading) {
      let tm = setTimeout(() => {
        clearTimeout(tm);
        setPage(p => p + 1);
      }, 1000);
    }
  };

  const renderItem = ({item, index, onPress}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: (screenWidth - 3 * (numColumns - 1)) / numColumns,
          height: (screenWidth - 3 * (numColumns - 1)) / numColumns,
          backgroundColor: '#000',
          marginRight: (index + 1) % numColumns === 0 ? 0 : 3,
          marginTop: 3,
        }}>
        <FastImage
          source={{
            // uri: item.uri,
            uri: 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
          // onError={() => setBookThumbnail('bookDefault')}
        />
      </TouchableOpacity>
    );
  };

  const PureItem = memo(renderItem, () => {
    return true;
  });

  return (
    <RootLayout
      topbar={{
        title:
          route.params?.member_id?.split('@')[0]?.length > 12
            ? route.params?.member_id?.split('@')[0]?.substring(0, 12) + '...'
            : route.params?.member_id?.split('@')[0],
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
        optionsSearch: {
          component: <Image style={styles.cameraIcon} source={images.search} />,
          name: 'search',
          onPress: () =>
            navigation.navigate(routes.search, {
              timeKey: Date.now(),
            }),
        },
        optionsAvator: {
          component: (
            <Avatar
              size={29}
              style={styles.avator}
              path={
                user?.profile_path
                  ? user?.profile_path
                  : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
              }
            />
          ),
          name: 'avator',
          onPress: () =>
            navigation.navigate(routes.feedBookUser, {
              timeKey: Date.now(),
              member_id: user.member_id,
              platform_type: user.platform_type,
            }),
        },
      }}>
      <View style={styles.root}>
        <View style={styles.infoContainer}>
          <Avatar
            size={widthPercentage(65)}
            style={styles.avator}
            path={
              myInfo === true
                ? user?.profile_path
                  ? user?.profile_path
                  : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
                : route.params?.uri
                ? route.params?.uri
                : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
            }
          />
          {!myInfo && (
            <ButtonWrap
              style={
                route.params?.status ? styles.status : styles.statusOutline
              }
              styleTitle={route.params?.status && styles.statusTitle}
              outline={!route.params?.status && true}>
              {route.params?.status ? '팔로잉' : '팔로우'}
            </ButtonWrap>
          )}
          <View style={[styles.info, {marginLeft: widthPercentage(60)}]}>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>10</TextWrap>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>게시물</TextWrap>
          </View>
          <TouchableOpacity
            style={styles.info}
            onPress={() =>
              navigation.navigate(routes.follow, {
                timeKey: Date.now(),
                member_id: route.params.member_id,
                platform_type: user.platform_type,
                type: 'follower',
              })
            }>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>7</TextWrap>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>팔로워</TextWrap>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.info, {marginRight: widthPercentage(43.6)}]}
            onPress={() =>
              navigation.navigate(routes.follow, {
                timeKey: Date.now(),
                member_id: route.params.member_id,
                platform_type: user.platform_type,
                type: 'follow',
              })
            }>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>11</TextWrap>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>팔로잉</TextWrap>
          </TouchableOpacity>
        </View>
        <View>
          <TabsIcon
            style={styles.tabs}
            index={tabIndex}
            onIndexChange={t => {
              if (tabIndex !== t) {
                setData([]);
              }
              setNumColumns(3);
              setTabIndex(t);
            }}
            data={['my', 'other']}
          />
        </View>

        <View>
          <PinchGestureHandler onGestureEvent={handleGesture}>
            <FlatList
              key={String(numColumns)}
              ref={listRef}
              numColumns={numColumns}
              extraData={data}
              data={data}
              showsVerticalScrollIndicator={false}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.6}
              ListFooterComponent={
                loading && (
                  <ActivityIndicator
                    size="large"
                    style={{
                      alignSelf: 'center',
                      marginTop: 20,
                      marginBottom: 150,
                    }}
                    color={colors.primary}
                  />
                )
              }
              keyExtractor={(item, index) => index.toString()}
              // renderItem={renderItem}
              renderItem={({item, index}) => {
                return (
                  <PureItem
                    item={item}
                    index={index}
                    onPress={() => {
                      // console.log(item);
                    }}
                  />
                );
              }}
            />
          </PinchGestureHandler>
        </View>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  infoContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    marginTop: 10,
  },

  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  status: {
    position: 'absolute',
    bottom: 0,
    left: widthPercentage(60),
    width: widthPercentage(42),
    height: heightPercentage(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006fff',
  },
  statusOutline: {
    position: 'absolute',
    bottom: 0,
    left: widthPercentage(60),
    width: widthPercentage(42),
    height: heightPercentage(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    color: colors.white,

    fontSize: fontPercentage(10),
    lineHeight: fontPercentage(19),
  },
});
