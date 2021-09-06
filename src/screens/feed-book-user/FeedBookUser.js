import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  Share,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import {requestGet, requestPost} from '../../services/network';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
} from '../../services/util';
import RootLayout from '../../layouts/root-layout/RootLayout';
// import NormalLayout from '../../layouts/normal-layout/NormalLayout';

import Avatar from '../../components/avatar/Avatar';
import {dialogOpenSelect, dialogError} from '../../redux/dialog/DialogActions';
import {getFeedUser, booksUpdate} from '../../redux/book/BookActions';
import {FeedUserItem} from './FeedUserItem';

export default function FeedBookUser({route, navigation}) {
  const user = useSelector(s => s.user);
  const {isLoading, isRefreshing, userBooks} = useSelector(s => s.book);
  const [likeLoading, setLikeLoading] = useState(false);

  const dispatch = useDispatch();
  const listRef = useRef();
  const isFocused = useIsFocused();

  const limit = 36;
  const [page, setPage] = useState(1);
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  const [scrollToIdx, setScrollToIdx] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [toggleIndex, setToggleIndex] = useState(0); // 좋아요 animation 전체 뜨는거 방지
  const [lastTap, setLastTap] = useState(null); // 더블탭 시간 대기
  const opacity = useRef(new Animated.Value(0)).current;

  const fetchFeedData = (type, newTime, routeParamsPage) => {
    if (type === 'reset') {
      dispatch(
        getFeedUser(
          route.params?.memberIdx,
          1,
          limit * (routeParamsPage || 1),
          newTime,
        ),
      );
    } else {
      dispatch(getFeedUser(route.params?.memberIdx, page, limit, time));
    }
  };

  const getPage = newTime => {
    requestGet({
      url: consts.apiUrl + '/mypage/feedBook/paging',
      query: {
        memberIdx: route.params.memberIdx,
        startPaging: 0, // limit start
        endPaging: limit, // limit end
        feedIdx: route.params.feedIdx,
        time: newTime,
      },
    })
      .then(data => {
        setPage(data.data?.page);
        // dispatch(booksUpdate(data.data.myFeedBook, 'user'));
        // new page로 바꿔야 할듯싶다
        // page scrolling 이 괜히 한번더돌아서
        // new page 있으면 그걸로 패이징 하고 아니면 기존 page로 스크롤링
        fetchFeedData('reset', newTime, data.data?.page);
      })
      .catch(e => {});
  };

  useEffect(() => {
    let mount = true;
    if (mount && isFocused && page !== 1) {
      if (route.params?.page) {
        const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
        fetchFeedData('reset', newTime, route.params?.page);
      } else {
        fetchFeedData();
      }
    }
    return () => {
      mount = false;
    };
  }, [page]);

  useEffect(() => {
    let mount = true;
    setPageLoading(true);

    if (mount && isFocused) {
      const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
      setTime(newTime);
      if (route.params.allFeedDetail) {
        getPage(newTime);
      } else {
        if (route.params?.page) {
          setPage(route.params?.page);
        } else {
          fetchFeedData('reset', newTime, route.params?.page);
        }
      }
    }
    return () => (mount = false);
  }, [route.params?.memberIdx]);

  useEffect(() => {
    let mount = true;
    if (route.params.isNew) {
      listRef.current?.scrollToOffset({y: 0, animated: true});
    } else {
      const scrollIndex = userBooks?.findIndex(
        x => x?.feedIdx === route.params?.feedIdx,
      );
      mount && setScrollToIdx(scrollIndex);
    }
    return () => (mount = false);
  }, [route.params.feedIdx]);

  useEffect(() => {
    let mount = true;
    setPageLoading(false);
    if (mount && isFocused && route.params?.allFeedDetail) {
      const scrollIndex = userBooks?.findIndex(
        x => x?.feedIdx === route.params?.feedIdx,
      );
      setScrollToIdx(scrollIndex);
    }
    return () => {
      mount = false;
    };
  }, [userBooks]);

  useEffect(() => {
    let mount = true;
    if (
      mount &&
      pageLoading === false &&
      scrollToIdx !== -1 &&
      scrollToIdx !== null
    ) {
      listRef.current?.scrollToIndex({
        animated: false,
        index: scrollToIdx,
      });
    }
    return () => {
      mount = false;
    };
  }, [scrollToIdx]);

  useEffect(() => {
    let mount = true;
    if (mount && route.params.isNew && isFocused) {
      const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
      setTime(newTime);
      fetchFeedData('reset', newTime);
    }
    return () => (mount = false);
  }, [route.params.key]);

  useEffect(() => {
    let mount = true;
    mount && setPageLoading(true);
    return () => {
      mount = false;
    };
  }, []);

  const editOnPress = () => {
    dispatch(
      dialogOpenSelect({
        item: [
          {
            name: '수정',
            // onPress: () => ,
          },
          {
            name: '삭제',
            // onPress: () => ,
          },
        ],
      }),
    );
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: '공유에 보이는 메세지 link',
        url: 'http://bam.tech',
        title: 'Wow, did you see that?',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  const toggleHeart = feed_idx => {
    setToggleIndex(feed_idx);
    setLikeLoading(true);
    if (userBooks.length > 0) {
      const modifiedList = userBooks?.map((element, index) => {
        if (element.feedIdx === feed_idx) {
          const idx = element.likeMemberList.indexOf(user.member_idx);
          if (idx === -1) {
            requestPost({
              url: consts.apiUrl + '/mypage/feedBook/like',
              body: {
                feedIdx: feed_idx,
                flagLike: 0,
              },
            })
              .then(data => {
                element.likeMemberList.push(user.member_idx);
                element.likeCnt += 1;
                setLikeLoading(false);
              })
              .catch(e => {
                dispatch(dialogError(e));
                setLikeLoading(false);
              });
          } else {
            requestPost({
              url: consts.apiUrl + '/mypage/feedBook/like',
              body: {
                feedIdx: feed_idx,
                flagLike: 1,
              },
            })
              .then(data => {
                element.likeMemberList.splice(idx, 1);
                element.likeCnt -= 1;
                setLikeLoading(false);
              })
              .catch(e => {
                dispatch(dialogError(e));
                setLikeLoading(false);
              });
          }
        }
        return element;
      });
      // dispatch(booksUpdate(modifiedList, 'user'));
      fillHeart();
    }
  };

  const fillHeart = () => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.quad,
        useNativeDriver: true,
      }),
      Animated.delay(600),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDoubleTap = feed_idx => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 1000;
    if (!likeLoading) {
      if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
        toggleHeart(feed_idx);
      } else {
        setLastTap(now);
      }
    }
  };

  const handleRefresh = () => {
    setPage(1);
    const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
    setTime(newTime);
    fetchFeedData('reset', newTime);
  };

  const onEndReached = e => {
    if (isFocused) {
      if (
        !isLoading &&
        !isRefreshing &&
        e.distanceFromEnd > 0 &&
        userBooks.length >= limit * page
      ) {
        setPage(p => p + 1);
      }
    }
  };

  const renderItem = ({item, index}) => (
    <FeedUserItem
      {...item}
      index={index}
      login_id={user.member_id}
      login_idx={user.member_idx}
      userProfile={user.profile_path}
      editOnPress={editOnPress}
      onShare={onShare}
      toggleHeart={toggleHeart}
      handleDoubleTap={handleDoubleTap}
      opacity={opacity}
      toggleIndex={toggleIndex}
    />
  );

  const renderFooter = () => {
    if (userBooks?.length === 0 || !isLoading) {
      return <></>;
    } else {
      return (
        <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            top: -50,
          }}
          color={colors.blue}
        />
      );
    }
  };

  const keyExtractor = useCallback((item, index) => {
    return item?.feedIdx.toString() + index.toString();
  }, []);
  const memoizedRenderItem = useMemo(() => renderItem, [toggleHeart]);

  return (
    <RootLayout
      topbar={{
        title: route.params?.memberId
          ? route.params?.memberId?.split('@')[0]?.length > 12
            ? route.params?.memberId?.split('@')[0]?.substring(0, 12) + '...'
            : route.params?.memberId?.split('@')[0]
          : '유저 피드북',
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
              platformType: user.platform_type,
              key: Date.now(),
            });
          },
        },
      }}>
      {pageLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator
            size="large"
            style={{
              alignSelf: 'center',
              top: -50,
            }}
            color={colors.blue}
          />
        </View>
      ) : (
        <FlatList
          initialNumToRender={userBooks?.length}
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
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          maxToRenderPerBatch={3} // 보통 2개 항목이 화면을 체울경우 3~5 , 5개 항목이 체울경우 8
          windowSize={5} // 위 2개 가운데 1개 아래2개 보통 2개 항목이 화면을 체울경우 5
          ListFooterComponent={renderFooter}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 100));
            wait.then(() => {
              listRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
              });
            });
          }}
        />
      )}
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
});
