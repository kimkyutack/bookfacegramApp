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
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
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
import {
  getFeedHome,
  getFeedUser,
  booksUpdate,
} from '../../redux/book/BookActions';
import {dialogOpenSelect, dialogError} from '../../redux/dialog/DialogActions';
import FastImage from 'react-native-fast-image';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';

export default function FeedBookImage({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const {
    isLoading,
    userBooks,
    allBooks,
    errorMessage,
    profilePath,
    followerCnt,
    followingCnt,
  } = useSelector(s => s.book, shallowEqual);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const listRef = useRef();
  const [myInfo, setMyInfo] = useState(true);

  // console.log('user route.params?.member_idx', route.params?.member_idx);
  const limit = 36;
  const [page, setPage] = useState(1);
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  const [tabIndex, setTabIndex] = useState(0); // 0 my 1 other
  const [numColumns, setNumColumns] = useState(3); // pinch zoom columns number

  const fetchUserData = reset => {
    if (reset) {
      dispatch(getFeedUser(route.params?.member_idx, 1, limit, time));
    } else {
      dispatch(getFeedUser(route.params?.member_idx, page, limit, time));
    }
  };

  const fetchWholeData = () => {};

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
    if (route.params?.member_idx === user.member_idx) {
      setMyInfo(true);
    } else {
      setMyInfo(false);
    }
    listRef.current?.scrollToOffset({y: 0, animated: false});
    setPage(1);
    setTabIndex(0);
    setTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    fetchUserData(true);
  }, [route.params?.member_idx, isFocused]);

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
    if (!isLoading && e.distanceFromEnd > 0 && !errorMessage) {
      setPage(p => p + 1);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.feedBookUser, {
            member_id: item.memberId,
            member_idx: item.memberIdx,
            feedIdx: item.feedIdx,
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
            uri: item.feedImgName?.length
              ? consts.imgUrl + '/feedBook/' + item.feedImgName[0]
              : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
        />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isLoading) {
      return <></>;
    } else {
      return (
        <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            top: -70,
          }}
          color={colors.blue}
        />
      );
    }
  };

  const memoizedRenderItem = useMemo(() => renderItem, [handleGesture]);
  const keyExtractor = useCallback((item, index) => {
    return item?.feedIdx.toString() + index.toString();
  }, []);

  return (
    <RootLayout
      topbar={{
        title: route.params?.member_id
          ? route.params?.member_id?.split('@')[0]?.length > 12
            ? route.params?.member_id?.split('@')[0]?.substring(0, 12) + '...'
            : route.params?.member_id?.split('@')[0]
          : '유저피드북',
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
          onPress: () => {
            navigation.navigate(routes.feedBookImage, {
              member_id: user.member_id,
              member_idx: user.member_idx,
              platform_type: user.platform_type,
            });
          },
        },
      }}>
      <View style={styles.root}>
        <View style={styles.infoContainer}>
          <Avatar
            size={widthPercentage(65)}
            style={styles.avator}
            path={
              profilePath
                ? profilePath
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
                member_id: route.params.member_id,
                member_idx: route.params.member_idx,
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
                member_id: route.params.member_id,
                member_idx: route.params.member_idx,
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
                // setData([]);
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
            data={userBooks}
            extraData={userBooks}
            removeClippedSubviews={true}
            disableVirtualization={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor} // arrow 함수 자제
            renderItem={memoizedRenderItem} // arrow 함수 자제
            onEndReached={onEndReached}
            onEndReachedThreshold={1}
            ListFooterComponent={renderFooter}
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
