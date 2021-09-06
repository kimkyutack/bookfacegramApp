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
  userPageUpdate,
  getFeedAll,
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
    allErrorMessage,
    profilePath,
    followerCnt,
    followingCnt,
    totalCnt,
  } = useSelector(s => s.book);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const listRef = useRef();
  const [myInfo, setMyInfo] = useState(true);

  const limit = 36;
  const [allPage, setAllPage] = useState(1);
  const [page, setPage] = useState(1);
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  const [followerCount, setFollowerCount] = useState(followerCnt);
  const [followingCount, setFollowingCount] = useState(followingCnt);
  const [totalCount, setTotalCount] = useState(totalCnt);
  const [userProfilePath, setUserProfilePath] = useState(profilePath);

  const [tabIndex, setTabIndex] = useState(0); // 0 my 1 other
  const [numColumns, setNumColumns] = useState(3); // pinch zoom columns number

  const fetchUserData = (type, newTime) => {
    if (type === 'reset') {
      dispatch(getFeedUser(route.params?.memberIdx, 1, limit, newTime));
    } else {
      dispatch(getFeedUser(route.params?.memberIdx, page, limit, time));
    }
  };

  const fetchWholeData = (type, newTime) => {
    if (type === 'reset') {
      dispatch(getFeedAll(1, limit, newTime));
    } else {
      dispatch(getFeedAll(allPage, limit, time));
    }
  };

  useEffect(() => {
    if (isFocused && allPage !== 1) {
      fetchWholeData();
    }
  }, [allPage]);

  useEffect(() => {
    if (isFocused && page !== 1) {
      fetchUserData();
    }
  }, [page]);

  useEffect(() => {
    if (isFocused) {
      listRef.current?.scrollToOffset({y: 0, animated: true});
      const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
      if (tabIndex === 1) {
        setAllPage(1);
        setTime(newTime);
        fetchWholeData('reset', newTime);
      } else {
        setPage(1);
        fetchUserData('reset', newTime);
      }
    }
  }, [tabIndex]);

  useEffect(() => {
    if (isFocused) {
      const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
      setTime(newTime);
      fetchUserData('reset', newTime);
    }
  }, [route.params?.memberIdx]);

  useEffect(() => {
    if (tabIndex === 1 && isFocused) {
      setTabIndex(0);
    }
    if (route.params?.memberIdx === user.member_idx && isFocused) {
      setMyInfo(true);
    } else {
      setMyInfo(false);
    }
  }, [route.params.key]);

  useEffect(() => {
    let mount = true;
    if (isFocused && mount) {
      setFollowerCount(followerCnt);
      setFollowingCount(followingCnt);
      setTotalCount(totalCnt);
      setUserProfilePath(profilePath);
    }
    return () => {
      mount = false;
    };
  }, [followerCnt, followingCnt, totalCnt, profilePath, userBooks]);

  useEffect(() => {
    if (errorMessage === 'nodata') {
      dispatch(booksUpdate([], 'user'));
    }
  }, [errorMessage]);

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
    if (isFocused) {
      if (tabIndex === 0) {
        if (
          !isLoading &&
          e.distanceFromEnd > 0 &&
          userBooks.length >= limit * page
        ) {
          setPage(p => p + 1);
        }
      } else {
        if (
          !isLoading &&
          e.distanceFromEnd > 0 &&
          allBooks.length >= limit * allPage
        ) {
          setAllPage(p => p + 1);
        }
      }
    }
  };

  const onPress = item => {
    if (tabIndex === 0) {
      navigation.navigate(routes.feedBookUser, {
        memberId: item.memberId,
        memberIdx: item.memberIdx,
        feedIdx: item.feedIdx,
        page: page,
        isNew: false,
        allFeedDetail: false,
      });
    } else {
      navigation.navigate(routes.feedBookUser, {
        memberId: item.memberId,
        memberIdx: item.memberIdx,
        feedIdx: item.feedIdx,
        isNew: false,
        allFeedDetail: true,
      });
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
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
        title: route.params?.memberId
          ? route.params?.memberId?.split('@')[0]?.length > 12
            ? route.params?.memberId?.split('@')[0]?.substring(0, 12) + '...'
            : route.params?.memberId?.split('@')[0]
          : '전체피드북',
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
              memberId: user.member_id,
              memberIdx: user.member_idx,
              key: Date.now(),
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
              userProfilePath
                ? userProfilePath
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
            <TextWrap font={fonts.kopubWorldDotumProMedium}>
              {totalCount ? totalCount : 0}
            </TextWrap>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>게시물</TextWrap>
          </View>
          <TouchableOpacity
            style={styles.info}
            onPress={() =>
              navigation.navigate(routes.follow, {
                memberId: route.params.memberId,
                memberIdx: route.params.memberIdx,
                followerCnt: followerCount,
                followingCnt: followingCount,
                type: 'follower',
              })
            }>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>
              {followerCount ? followerCount : 0}
            </TextWrap>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>팔로워</TextWrap>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.info, {marginRight: widthPercentage(43.6)}]}
            onPress={() =>
              navigation.navigate(routes.follow, {
                memberId: route.params.memberId,
                memberIdx: route.params.memberIdx,
                followerCnt: followerCount,
                followingCnt: followingCount,
                type: 'follow',
              })
            }>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>
              {followingCount ? followingCount : 0}
            </TextWrap>
            <TextWrap font={fonts.kopubWorldDotumProMedium}>팔로잉</TextWrap>
          </TouchableOpacity>
        </View>
        <View>
          <TabsIcon
            style={styles.tabs}
            index={tabIndex}
            onIndexChange={t => {
              // if (tabIndex !== t) {
              //   setData([]);
              // }
              listRef.current?.scrollToOffset({y: 0, animated: true});
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
            initialNumToRender={36}
            ref={listRef}
            data={tabIndex === 0 ? userBooks : allBooks}
            extraData={tabIndex === 0 ? userBooks : allBooks}
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
