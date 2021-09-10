import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
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
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import moment from 'moment';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import routes from '../../libs/routes';
import {requestGet, requestPost} from '../../services/network';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
  cameraItem,
} from '../../services/util';
import RootLayout from '../../layouts/root-layout/RootLayout';
import Topbar from '../../components/topbar/Topbar';
import Avatar from '../../components/avatar/Avatar';
import {dialogOpenSelect, dialogError} from '../../redux/dialog/DialogActions';
import {getFeedUser, getFeedAll} from '../../redux/book/BookActions';
import {FeedUserItem} from './FeedBookFeedItem';
import {useIsFocused} from '@react-navigation/core';

export default function FeedBookFeed({route, navigation}) {
  const user = useSelector(s => s.user);
  const {isLoading, userBooks, allBooks, userPage, allPage} = useSelector(
    s => s.book,
  );

  const dispatch = useDispatch();
  const listRef = useRef();
  const isFocused = useIsFocused();

  const limit = 24;
  const [likeLoading, setLikeLoading] = useState(false);
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  const [toggleIndex, setToggleIndex] = useState(0); // 좋아요 animation 전체 뜨는거 방지
  const [lastTap, setLastTap] = useState(null); // 더블탭 시간 대기
  const opacity = useRef(new Animated.Value(0)).current;

  const fetchUserFeed = (type, newTime) => {
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

  const fetchWholeData = newTime => {
    dispatch(getFeedAll(allPage + 1, limit, time));
  };

  useEffect(() => {
    let mount = true;
    if (mount && isFocused) {
      if (route.params?.isNewFeed) {
        listRef.current?.scrollToOffset({y: 0, animated: false});
        const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
        setTime(newTime);
        fetchUserFeed('reset', newTime);
      } else {
        listRef.current?.scrollToIndex({
          animated: false,
          index: route.params?.index ? route.params?.index : 0,
        });
      }
    }
    return () => {
      mount = false;
    };
  }, [route.params?.key, route.params?.isNewFeed]);

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
    if (userBooks?.length > 0) {
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
    if (!isLoading && e.distanceFromEnd > 0) {
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
    <SafeAreaView style={styles.root}>
      <FlatList
        initialNumToRender={limit}
        initialScrollIndex={route.params?.index}
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
        removeClippedSubviews={true}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
