import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Share,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { OptimizedFlatList } from 'react-native-optimized-flatlist';

import moment from 'moment';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import { requestDelete, requestPost } from '../../services/network';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
  screenHeight,
  screenWidth
} from '../../services/util';
import RootLayout from '../../layouts/root-layout/RootLayout';
import Topbar from '../../components/topbar/Topbar';
import Avatar from '../../components/avatar/Avatar';
import {
  dialogOpenMore,
  dialogOpenSelect,
  dialogError,
  dialogOpenAction,
  dialogOpenMessage,
} from '../../redux/dialog/DialogActions';
import { getFeedUser, getFeedAll } from '../../redux/book/BookActions';
import { FeedBookFeedItem } from './FeedBookFeedItem';
import { useIsFocused } from '@react-navigation/core';
import { navigate } from '../../services/navigation';
import { browsingTime } from '../../redux/session/SessionAction';

export default function FeedBookFeed({ route, navigation }) {
  const user = useSelector(s => s.user);
  const { isUserLoading, userBooks, allBooks, userPage, allPage } = useSelector(
    s => s.book,
  );

  const dispatch = useDispatch();
  const listRef = useRef();
  const isFocused = useIsFocused();
  const [sessionTime, setSessionTime] = useState('000000');

  const limit = 24;
  const [likeLoading, setLikeLoading] = useState(false);
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  const [refreshing, setRefreshing] = useState(false);
  const [scrolltop, setscrolltop] = useState(0);

  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;

  const [toggleIndex, setToggleIndex] = useState(0); // ????????? animation ?????? ????????? ??????
  const [lastTap, setLastTap] = useState(null); // ????????? ?????? ??????
  const opacity = useRef(new Animated.Value(0)).current;

  const fetchUserFeed = (type, newTime) => {
    setRefreshing(false);
    if (type === 'reset') {
      dispatch(
        getFeedUser(
          route.params?.memberId,
          route.params?.memberIdx,
          1,
          limit,
          newTime,
        ),
      );
    } else {
      dispatch(
        getFeedUser(
          route.params?.memberId,
          route.params?.memberIdx,
          userPage + 1,
          limit,
          time,
        ),
      );
    }
  };

  const fetchWholeData = (type, newTime) => {
    setRefreshing(false);
    if (type === 'reset') {
      dispatch(getFeedAll(1, limit, newTime, user.member_idx));
    } else {
      dispatch(getFeedAll(allPage + 1, limit, time, user.member_idx));
    }
  };

  let hour = 0, minute = 0, second = -1;

  function timeCount() {


    let dsp_hour, dsp_minute, dsp_second;

    second++;

    if (minute == 60) {
      hour++;
      minute = 0;
    }
    if (second == 60) {
      minute++;
      second = 0;
    }

    if (hour < 10)
      dsp_hour = '0' + hour;
    else
      dsp_hour = hour;

    if (minute < 10)
      dsp_minute = '0' + minute;
    else
      dsp_minute = minute;

    if (second < 10)
      dsp_second = '0' + second;
    else
      dsp_second = second;


    let date_state = dsp_hour + dsp_minute + dsp_second;


    setSessionTime(date_state);
  };

  //page ?????? ?????? ??????
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('?????????(???????????????)', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);


  useEffect(() => {
    let mount = true;
    if (mount && isFocused) {
      if (route.params?.isNewFeed) {
        listRef.current?.scrollToOffset({ y: 0.1, animated: false });
        const newTime = new Date(+new Date() + 3300 * 10000)
          .toISOString()
          .replace('T', ' ')
          .replace(/\..*/, '');
        setTime(newTime);
        fetchUserFeed('reset', newTime);
      } else {
        if (route.params?.index === 0) {
          listRef.current?.scrollToOffset({ y: 0, animated: false });
        } else {
          setTimeout(() => {
            listRef.current?.scrollToIndex({
              animated: false,
              index: route.params?.index,
            });
          }, 100);

        }
      }
    }
    return () => {
      mount = false;
    };
  }, [route.params?.key, route.params?.isNewFeed, listRef]);


  const feedEdit = feedIdx => {
    navigation.navigate(routes.feedBookEditor, {
      image: undefined,
      isNewFeed: false,
      key: Date.now(),
      name: 'gallery',
      idx: feedIdx,
    });
    //dispatch(dialogError('?????? ????????? ?????????...'));
  };

  const feedDelete = feedIdx => {
    requestDelete({
      url: consts.apiUrl + `/mypage/feedBook/my/${feedIdx}`,
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          dispatch(dialogError('?????????????????????.'));
          const newTime = new Date(+new Date() + 3300 * 10000)
            .toISOString()
            .replace('T', ' ')
            .replace(/\..*/, '');
          setTime(newTime);
          fetchUserFeed('reset', newTime);
          if (userBooks?.length - 1 === 0) {
            navigation.navigate(routes.feedBookImage, {
              screen: routes.feedBookUserImage,
              params: {
                memberId: user.member_id,
                memberIdx: user.member_idx,
                profile_path: user?.profile_path
                  ? user?.profile_path
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png',
                key: Date.now(),
              },
            });
          }
        } else if (res.status === 'FAIL') {
          // error ?????? ?????????
        } else {
        }
      })
      .catch(error => {
        dispatch(error);
        // error ?????? ?????????
      });
  };

  const editOnPress = feedIdx => {
    dispatch(
      dialogOpenMore({
        item: [
          {
            name: '??????',
            onPress: () => feedEdit(feedIdx),
          },
          {
            name: '??????',
            onPress: () =>
              dispatch(
                dialogOpenAction({
                  titleColor: '#005aff',
                  cancelTitle: '??????',
                  message: '????????? ?????????????????????????',
                  onPress: a => {
                    if (a) {
                      feedDelete(feedIdx);
                    }
                  },
                }),
              ),
          },
        ],
      }),
    );
  };

  const onShare = async (idx) => {
    try {
      const result = await Share.share({
        message: 'https://toaping.me/bookfacegram/html/feed_share.jsp?feedIdx=' + idx,
        url: 'https://toaping.me/bookfacegram/html/feed_share.jsp?feedIdx=' + idx,
        title: '???????????? ????????? ??????!',
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
    if (userBooks?.length > 0 && route.params.infoType === 'user') {
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
      fillHeart();
    } else if (allBooks?.length > 0 && route.params.infoType === 'all') {
      const modifiedList = allBooks?.map((element, index) => {
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

  const onEndReached = e => {
    if (!isUserLoading && e.distanceFromEnd > 0) {
      if (
        route.params?.infoType &&
        route.params?.infoType === 'user' &&
        userBooks.length >= limit * userPage
      ) {
        fetchUserFeed();
      } else if (
        route.params?.infoType &&
        route.params?.infoType === 'all' &&
        allBooks.length >= limit * allPage
      ) {
        fetchWholeData();
      }
    }
  };

  const handleRefresh = async () => {
    const newTime = new Date(+new Date() + 3300 * 10000)
      .toISOString()
      .replace('T', ' ')
      .replace(/\..*/, '');
    setRefreshing(true);
    setTime(newTime);
    if (route.params?.infoType === 'user') {
      fetchUserFeed('reset', newTime);
    } else {
      fetchWholeData('reset', newTime);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <FeedBookFeedItem
        {...item}
        index={index}
        login_id={user?.member_id}
        login_idx={user?.member_idx}
        userProfile={user?.profile_path}
        editOnPress={editOnPress}
        onShare={onShare}
        toggleHeart={toggleHeart}
        handleDoubleTap={handleDoubleTap}
        opacity={opacity}
        toggleIndex={toggleIndex}
      />
    )
  };

  const renderFooter = () => {
    if (userBooks?.length === 0 || !isUserLoading) {
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
    <SafeAreaView style={styles.root}>
      <FlatList
        initialNumToRender={limit}
        ref={listRef}
        data={
          route.params?.infoType && route.params?.infoType === 'user'
            ? userBooks
            : allBooks
        }
        extraData={
          route.params?.infoType && route.params?.infoType === 'user'
            ? userBooks
            : allBooks
        }
        getItemLayout={(data, index) => ({
          length: heightPercentage(543.4),
          offset: heightPercentage(543.4) * index,
          index,
        })}
        disableVirtualization={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor} // arrow ?????? ??????
        renderItem={memoizedRenderItem} // arrow ?????? ??????
        onScroll={event => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        maxToRenderPerBatch={3} // ?????? 2??? ????????? ????????? ???????????? 3~5 , 5??? ????????? ???????????? 8
        windowSize={5} // ??? 2??? ????????? 1??? ??????2??? ?????? 2??? ????????? ????????? ???????????? 5
        ListFooterComponent={renderFooter}
      />
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listRef.current.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: 0,
    left: screenWidth / 2.2,
    display: 'flex',
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  none_button: {
    display: 'none',
  },
});
