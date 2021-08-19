import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
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
  const [limit, setLimit] = useState(36);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // 0 my 1 other
  const [numColumns, setNumColumns] = useState(3); // pinch zoom columns number

  // mock data
  const k = [
    {member_id: '123a', id: 1, uri: '1'},
    {member_id: '123b', id: 2, uri: '2'},
    {member_id: '123c', id: 3, uri: '3'},
    {member_id: '123d', id: 4, uri: '4'},
    {member_id: '123e', id: 5, uri: '5'},
    {member_id: '123f', id: 6, uri: '6'},
    {member_id: '123g', id: 7, uri: '7'},
    {member_id: '123h', id: 8, uri: '8'},
    {member_id: '123k', id: 9, uri: '9'},
    {member_id: '123l', id: 10, uri: '10'},
    {member_id: '123m', id: 11, uri: '11'},
    {member_id: '123n', id: 12, uri: '12'},
    {member_id: '123o', id: 13, uri: '13'},
    {member_id: '123p', id: 14, uri: '14'},
    {member_id: '123q', id: 15, uri: '15'},
    {member_id: '123r', id: 16, uri: '16'},
    {member_id: '123s', id: 17, uri: '17'},
    {member_id: '123t', id: 18, uri: '18'},
    {member_id: '123u', id: 19, uri: '19'},
    {member_id: '123v', id: 20, uri: '20'},
    {member_id: '123w', id: 21, uri: '21'},
    {member_id: '123x', id: 22, uri: '22'},
    {member_id: '123y', id: 23, uri: '23'},
    {member_id: '123z', id: 24, uri: '24'},
    {member_id: '123zz', id: 25, uri: '25'},
    {member_id: '123zzz', id: 26, uri: '26'},
    {member_id: '123zzzz', id: 27, uri: '27'},
    {member_id: '123zzzzz', id: 28, uri: '28'},
    {member_id: '123zzzzzz', id: 29, uri: '29'},
    {member_id: '123zzzzzzz', id: 30, uri: '30'},
    {member_id: '123zz1', id: 31, uri: '31'},
    {member_id: '123zzz2', id: 32, uri: '32'},
    {member_id: '123zzzz3', id: 33, uri: '33'},
    {member_id: '123zzzzz4', id: 34, uri: '34'},
    {member_id: '123zzzzzz5', id: 35, uri: '35'},
    {member_id: '123zzzzzzz6', id: 36, uri: '36'},
  ];
  const fetchUserData = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/users/' + user.member_id + '/friends',
      query: {
        member_id: route.params?.member_id
          ? route.params?.member_id
          : user.member_id,
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
    if (tabIndex === 0) {
      fetchUserData();
    } else {
      fetchWholeData();
    }
  }, [tabIndex]);

  useEffect(() => {
    if (page !== 1) {
      if (tabIndex === 0) {
        fetchUserData();
      } else {
        fetchWholeData();
      }
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
    setTabIndex(0);
    fetchUserData();
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
    if (!loading && e.distanceFromEnd > 0) {
      setPage(p => p + 1);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.feedBook, {
            timeKey: Date.now(),
            member_id: item.member_id,
            id: item.id,
          });
        }}
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

  const memoizedRenderItem = useMemo(() => renderItem, [handleGesture]);
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <RootLayout
      topbar={{
        title: route.params?.member_id
          ? route.params?.member_id?.split('@')[0]?.length > 12
            ? route.params?.member_id?.split('@')[0]?.substring(0, 12) + '...'
            : route.params?.member_id?.split('@')[0]
          : user.member_id,
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

        <PinchGestureHandler onGestureEvent={handleGesture}>
          <FlatList
            key={String(numColumns)}
            numColumns={numColumns}
            initialNumToRender={24}
            ref={listRef}
            data={data}
            extraData={data}
            removeClippedSubviews={true}
            disableVirtualization={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor} // arrow 함수 자제
            renderItem={memoizedRenderItem} // arrow 함수 자제
            onEndReached={onEndReached}
            onEndReachedThreshold={1}
            ListFooterComponent={
              loading && (
                <ActivityIndicator
                  size="large"
                  style={{
                    alignSelf: 'center',
                    marginTop: 50,
                    marginBottom: 50,
                  }}
                  color={colors.primary}
                />
              )
            }
          />
        </PinchGestureHandler>
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
