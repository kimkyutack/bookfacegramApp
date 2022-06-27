import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  FlatList,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Share,
  ActivityIndicator,
  Animated,
  Easing,
  TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

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
  screenWidth
} from '../../services/util';
import { dialogOpenSelect, dialogError } from '../../redux/dialog/DialogActions';
import { getNewestHashTag, getPopularHashTag } from '../../redux/tag/TagAction';
import { HashTagFeedItem } from './HashTagFeedItem';
import { useIsFocused } from '@react-navigation/core';
import { browsingTime } from '../../redux/session/SessionAction';

export default function HashTagFeed({ route, navigation }) {
  const user = useSelector(s => s.user);
  const {
    isPopularLoading,
    isNewestLoading,
    popularHashTags,
    newestHashTags,
    popularPage,
    newestPage,
  } = useSelector(s => s.tag);

  const dispatch = useDispatch();
  const listRef = useRef();
  const isFocused = useIsFocused();

  const limit = 24;
  const [likeLoading, setLikeLoading] = useState(false);
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  const [toggleIndex, setToggleIndex] = useState(0); // 좋아요 animation 전체 뜨는거 방지
  const [lastTap, setLastTap] = useState(null); // 더블탭 시간 대기
  const opacity = useRef(new Animated.Value(0)).current;
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const [sessionTime, setSessionTime] = useState('000000');

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

  //page 로그 찍는 로직
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('피드북(해시태그 상세)', sessionTime));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);

  const fetchPopularFeed = (type, newTime) => {
    if (type === 'reset') {
      dispatch(
        getPopularHashTag(route.params?.hashTag, 'popular', 1, limit, time),
      );
    } else {
      dispatch(
        getPopularHashTag(
          route.params?.hashTag,
          'popular',
          popularPage + 1,
          limit,
          time,
        ),
      );
    }
  };

  const fetchNewestData = (type, newTime) => {
    if (type === 'reset') {
      dispatch(
        getNewestHashTag(route.params?.hashTag, 'newest', 1, limit, time),
      );
    } else {
      dispatch(
        getNewestHashTag(
          route.params?.hashTag,
          'newest',
          newestPage + 1,
          limit,
          time,
        ),
      );
    }
  };

  useEffect(() => {
    let mount = true;
    if (mount && isFocused) {
      listRef.current?.scrollToIndex({
        animated: false,
        index: route.params?.index ? route.params?.index : 0,
      });
    }
    return () => {
      mount = false;
    };
  }, [route.params?.key]);

  const feedEdit = feedIdx => {
    dispatch(dialogError('수정 페이지 제작중...'));
  };

  const feedDelete = feedIdx => {
    dispatch(dialogError('삭제 페이지 제작중...'));
    // requestDelete({
    //   url: consts.apiUrl + `/mypage/feedBook/my/${feedIdx}`,
    // })
    //   .then(res => {
    //     if (res.status === 'SUCCESS') {
    //       const newTime = moment()
    //         .add(20, 'second')
    //         .format('YYYY-MM-DD HH:mm:ss');
    //       setTime(newTime);
    //       fetchUserFeed('reset', newTime);
    //     } else if (res.status === 'FAIL') {
    //       // error 일때 해야함
    //     } else {
    //     }
    //   })
    //   .catch(error => {
    //     dispatch(error);
    //     // error 일때 해야함
    //   });
  };

  const editOnPress = feedIdx => {
    dispatch(
      dialogOpenSelect({
        item: [
          {
            name: '수정',
            onPress: () => feedEdit(feedIdx),
          },
          {
            name: '삭제',
            onPress: () => feedDelete(feedIdx),
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
        title: '골라보는 맛있는 독서!',
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
    if (popularHashTags?.length > 0 && route.params.infoType === 'popular') {
      const modifiedList = popularHashTags?.map((element, index) => {
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
    } else if (
      newestHashTags?.length > 0 &&
      route.params.infoType === 'newest'
    ) {
      const modifiedList = newestHashTags?.map((element, index) => {
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
    if (!isPopularLoading && e.distanceFromEnd > 0) {
      if (
        route.params?.infoType &&
        route.params?.infoType === 'popular' &&
        popularHashTags.length >= limit * popularPage
      ) {
        fetchPopularFeed();
      } else if (
        route.params?.infoType &&
        route.params?.infoType === 'newest' &&
        newestHashTags.length >= limit * newestPage
      ) {
        fetchNewestData();
      }
    }
  };

  const renderItem = ({ item, index }) => (
    <HashTagFeedItem
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
  );

  const renderFooter = () => {
    if (route.params?.infoType === 'popular') {
      if (popularHashTags?.length === 0 || !isPopularLoading) {
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
    } else {
      if (newestHashTags?.length === 0 || !isNewestLoading) {
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
        initialScrollIndex={route.params?.index}
        ref={listRef}
        data={
          route.params?.infoType && route.params?.infoType === 'popular'
            ? popularHashTags
            : newestHashTags
        }
        extraData={
          route.params?.infoType && route.params?.infoType === 'popular'
            ? popularHashTags
            : newestHashTags
        }
        onScroll={event => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
        getItemLayout={(data, index) => ({
          length: heightPercentage(543.4),
          offset: heightPercentage(543.4) * index,
          index,
        })}
        disableVirtualization={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor} // arrow 함수 자제
        renderItem={memoizedRenderItem} // arrow 함수 자제
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        maxToRenderPerBatch={3} // 보통 2개 항목이 화면을 체울경우 3~5 , 5개 항목이 체울경우 8
        windowSize={5} // 위 2개 가운데 1개 아래2개 보통 2개 항목이 화면을 체울경우 5
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
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
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
});
