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
import {requestGet} from '../../services/network';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
} from '../../services/util';
import RootLayout from '../../layouts/root-layout/RootLayout';
import Avatar from '../../components/avatar/Avatar';
import {dialogOpenSelect, dialogError} from '../../redux/dialog/DialogActions';
import {
  getFeedHome,
  booksUpdate,
  initErrorMessage,
} from '../../redux/book/BookActions';
import {FeedItem} from './FeedItem';

export default function FeedBook({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const {isLoading, followBooks, errorMessage} = useSelector(s => s.book);

  const dispatch = useDispatch();
  const listRef = useRef();
  const isFocused = useIsFocused();

  const limit = 12;
  const [page, setPage] = useState(1);
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [toggleIndex, setToggleIndex] = useState(0); // 좋아요 animation 전체 뜨는거 방지
  const [lastTap, setLastTap] = useState(null); // 더블탭 시간 대기
  const [refreshing, setRefreshing] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const fetchFeedData = reset => {
    setRefreshing(false);
    if (reset) {
      dispatch(getFeedHome(1, limit, time));
    } else {
      dispatch(getFeedHome(page, limit, time));
    }
  };

  useEffect(() => {
    if (page !== 1) {
      fetchFeedData();
    }
  }, [page]);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const editOnPress = () => {
    dispatch(
      dialogOpenSelect({
        item: [
          {
            name: '수정',
            onPress: () => console.log('수정해'),
          },
          {
            name: '삭제',
            onPress: () => console.log('삭제해'),
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
    if (followBooks.length > 0) {
      const modifiedList = followBooks?.map((element, index) => {
        if (element.feedIdx === feed_idx) {
          const idx = element.likeMemberList.indexOf(user.member_idx);
          if (idx === -1) {
            element.likeMemberList.push(user.member_idx);
            element.likeCnt += 1;
          } else {
            element.likeMemberList.splice(idx, 1);
            element.likeCnt -= 1;
          }
        }
        return element;
      });
      dispatch(booksUpdate(modifiedList, 'follow'));
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
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      toggleHeart(feed_idx);
    } else {
      setLastTap(now);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    fetchFeedData(true);
  };

  const onEndReached = e => {
    if (!isLoading && e.distanceFromEnd > 0 && !errorMessage) {
      setPage(p => p + 1);
    }
  };

  const renderItem = ({item, index}) => (
    <FeedItem
      {...item}
      index={index}
      login_id={user.member_id}
      login_idx={user.member_idx}
      editOnPress={editOnPress}
      onShare={onShare}
      toggleHeart={toggleHeart}
      handleDoubleTap={handleDoubleTap}
      opacity={opacity}
      toggleIndex={toggleIndex}
    />
  );

  const memoizedRenderItem = useMemo(() => renderItem, [toggleHeart]);
  const keyExtractor = useCallback((item, index) => {
    return item?.feedIdx.toString() + index.toString();
  }, []);

  const renderFooter = () => {
    if (followBooks?.length === 0 || !isLoading) {
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

  return (
    <RootLayout
      topbar={{
        title: route.params?.member_id
          ? route.params?.member_id?.split('@')[0]?.length > 12
            ? route.params?.member_id?.split('@')[0]?.substring(0, 12) + '...'
            : route.params?.member_id?.split('@')[0]
          : '피드북',
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
      <FlatList
        initialNumToRender={12}
        ref={listRef}
        data={followBooks}
        extraData={followBooks}
        removeClippedSubviews={true}
        disableVirtualization={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor} // arrow 함수 자제
        renderItem={memoizedRenderItem} // arrow 함수 자제
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        maxToRenderPerBatch={3} // 보통 2개 항목이 화면을 체울경우 3~5 , 5개 항목이 체울경우 8
        windowSize={5} // 위 2개 가운데 1개 아래2개 보통 2개 항목이 화면을 체울경우 5
        ListFooterComponent={renderFooter}
      />
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
