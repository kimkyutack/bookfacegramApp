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
  Button,
  SafeAreaView,
  TouchableOpacity,
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
  screenWidth,
  screenHeight,
} from '../../services/util';
import RootLayout from '../../layouts/root-layout/RootLayout';
import Avatar from '../../components/avatar/Avatar';
import {
  dialogOpenSelect,
  dialogOpenMore,
  dialogError,
} from '../../redux/dialog/DialogActions';
import {getFeedHome} from '../../redux/book/BookActions';
import {FeedItem} from './FeedItem';
import Topbar from '../../components/topbar/Topbar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Footer from '../../libs/footer';

export default function FeedBook({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const {isFollowLoading, followBooks, followErrorMessage} = useSelector(
    s => s.book,
  );
  const [likeLoading, setLikeLoading] = useState(false);

  const dispatch = useDispatch();
  const listRef = useRef();
  const isFocused = useIsFocused();
  const [currentScroll, setCurrentScroll] = useState(1);
  const limit = 12;
  const [page, setPage] = useState(1);
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [toggleIndex, setToggleIndex] = useState(0); // 좋아요 animation 전체 뜨는거 방지
  const [lastTap, setLastTap] = useState(null); // 더블탭 시간 대기
  const [refreshing, setRefreshing] = useState(false);
  const [scrolltop, setscrolltop] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;

  const fetchFeedData = (reset, newTime) => {
    setRefreshing(false);
    if (reset) {
      dispatch(getFeedHome(1, limit, newTime));
    } else {
      dispatch(getFeedHome(page, limit, time));
    }
  };

  useEffect(() => {
    if (isFocused && page !== 1) {
      fetchFeedData();
    }
  }, [page]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      fetchFeedData();
    }
    return () => {
      mount = false;
    };
  }, []);

  const editOnPress = feedIdx => {
    dispatch(
      dialogOpenMore({
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
    if (followBooks.length > 0) {
      const modifiedList = followBooks?.map((element, index) => {
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
                setLikeLoading(false);
                dispatch(dialogError(e));
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
    const DOUBLE_PRESS_DELAY = 300;
    if (!likeLoading) {
      if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
        toggleHeart(feed_idx);
      } else {
        setLastTap(now);
      }
    }
  };

  /*const scrollHandler = () => {
      setscrolltop(1);
    setTimeout( () => {
      setscrolltop(0);
    }, 2000);
  }*/
  const handleRefresh = async () => {
    const newTime = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace('T', ' ')
      .replace(/\..*/, '');
    setRefreshing(true);
    setPage(1);
    setTime(newTime);
    fetchFeedData(true, newTime);
  };

  const onEndReached = e => {
    if (!isFollowLoading && followBooks.length >= page * limit) {
      setPage(p => p + 1);
    }
  };

  const renderItem = ({item, index}) => (
    <FeedItem
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

  const memoizedRenderItem = useMemo(() => renderItem, [toggleHeart]);
  const keyExtractor = useCallback((item, index) => {
    return item?.feedIdx.toString() + index.toString();
  }, []);

  const renderFooter = () => {
    if (followBooks?.length === 0 || !isFollowLoading) {
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
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Topbar
        title="피드북"
        navigation={navigation}
        back={true}
        options={{
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          name: 'camera',
          onPress: () =>
            dispatch(
              dialogOpenSelect({
                item: cameraItem(),
              }),
            ),
        }}
        optionsSearch={{
          component: (
            <Image style={styles.cameraIcon} source={images.feedCamera} />
          ),
          name: 'search',
          onPress: () =>
            navigation.navigate(routes.search, {
              timeKey: Date.now(),
            }),
        }}
        optionsAvator={{
          component: (
            <Avatar
              size={29}
              style={styles.avator}
              path={
                user?.profile_path
                  ? user?.profile_path
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
              }
            />
          ),
          name: 'avator',
          onPress: () => {
            navigation.navigate(routes.feedBookImage, {
              screen: routes.feedBookUserImage,
              params: {
                memberId: user.member_id,
                memberIdx: user.member_idx,
                key: Date.now(),
              },
            });
          },
        }}
      />
      {followBooks?.length === 0 ? (
        <View style={styles.root}>
          {followErrorMessage ? (
            <TextWrap>{followErrorMessage}</TextWrap>
          ) : (
            <ActivityIndicator
              size="large"
              style={{
                alignSelf: 'center',
                top: -50,
              }}
              color={colors.blue}
            />
          )}
        </View>
      ) : (
        <FlatList
          initialNumToRender={limit}
          ref={listRef}
          data={followBooks}
          extraData={followBooks}
          removeClippedSubviews={true}
          disableVirtualization={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor} // arrow 함수 자제
          renderItem={memoizedRenderItem} // arrow 함수 자제
          onEndReached={onEndReached}
          onEndReachedThreshold={0.6}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          maxToRenderPerBatch={3} // 보통 2개 항목이 화면을 체울경우 3~5 , 5개 항목이 체울경우 8
          windowSize={5} // 위 2개 가운데 1개 아래2개 보통 2개 항목이 화면을 체울경우 5
          ListFooterComponent={renderFooter}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          listRef.current.scrollToOffset({animated: true, offset: 0});
        }}
        style={scrolltop === 1 ? styles.button : styles.none_button}>
        <Image source={images.scrollTop} style={styles.scrolltotop} />
      </TouchableOpacity>
      <Footer page="feed" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  scrolltotop: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'contain',
  },
  button: {
    alignItems: 'center',
    width: widthPercentage(30),
    height: heightPercentage(30),
    position: 'absolute',
    top: screenHeight / 1.16,
    left: screenWidth / 2.16,
    display:'flex',
  },
  none_button: {
    display:'none',
  },
});
