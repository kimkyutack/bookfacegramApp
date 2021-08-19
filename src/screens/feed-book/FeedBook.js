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
import {FeedItem} from './FeedItem';

export default function FeedBook({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listRef = useRef();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggleIndex, setToggleIndex] = useState(0); // 좋아요 animation 전체 뜨는거 방지
  const [lastTap, setLastTap] = useState(null); // 더블탭 시간 대기
  const [refreshing, setRefreshing] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  // mock data
  const k = [
    {
      id: 1,
      member_id: 'l879465213@naver.com',
      member_idx: 29,
      uri: '1',
      likes: 121,
      replys: 10,
      contents: '본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      likeMemberList: [45, 29],
      hashTag: [
        '심판',
        '베르나르베르베르',
        '독서',
        '기록',
        '심판',
        '베르나르베르베르',
        '독서',
        '기록',
        '심판',
        '베르나르베르베르',
        '독서',
        '기록',
        '심판',
        '베르나르베르베르',
        '독서',
        '기록',
        '심판',
        '베르나르베르베르',
        '독서',
        '기록',
        '심판',
        '베르나르베르베르',
        '독서',
        '기록',
      ],
      joinDate: '2021.07.31',
    },
    {
      id: 2,
      member_id: '아이디2',
      member_idx: 45,
      uri: '2',
      likes: 122,
      likeMemberList: [45, 29],
      replys: 12,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      hashTag: ['심판', '베르나르베르베르', '독서'],
      joinDate: '2021.07.31',
    },
    {
      id: 3,
      member_id: '아이디3',
      member_idx: 31,
      uri: '3',
      likeMemberList: [30],
      likes: 123,
      replys: 13,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.',
      hashTag: ['심판', '독서'],
      joinDate: '2021.07.31',
    },
    {
      id: 4,
      member_id: '아이디4',
      member_idx: 32,
      uri: '4',
      likeMemberList: [],
      likes: 124,
      replys: 14,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 5,
      member_id: '아이디5',
      member_idx: 33,
      uri: '5',
      likeMemberList: [31],
      likes: 125,
      replys: 15,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용',
      joinDate: '2021.07.31',
    },
    {
      id: 6,
      member_id: '아이디6',
      member_idx: 34,
      uri: '6',
      likes: 126,
      likeMemberList: [32],
      replys: 16,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 7,
      member_id: '아이디7',
      member_idx: 35,
      uri: '7',
      likes: 127,
      likeMemberList: [33],
      replys: 17,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 8,
      member_id: '아이디8',
      member_idx: 36,
      uri: '8',
      likes: 128,
      likeMemberList: [34],
      replys: 18,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 9,
      member_id: '아이디9',
      member_idx: 37,
      uri: '9',
      likes: 129,
      likeMemberList: [35],
      replys: 19,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 10,
      member_id: '아이디10',
      member_idx: 38,
      uri: '10',
      likeMemberList: [36],
      likes: 121,
      replys: 10,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 11,
      member_id: '아이디11',
      member_idx: 39,
      uri: '11',
      likeMemberList: [37],
      likes: 121,
      replys: 11,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 12,
      member_id: '아이디12',
      member_idx: 40,
      uri: '12',
      likes: 122,
      likeMemberList: [38],
      replys: 12,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    // {
    //   id: 13,
    //   member_id: '아이디13',
    //   uri: '13',
    //   likes: 123,
    //   replys: 13,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 14,
    //   member_id: '아이디14',
    //   uri: '14',
    //   likes: 124,
    //   replys: 14,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 15,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 16,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 17,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 18,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 19,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 20,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 21,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 22,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 23,
    //   member_id: '아이디23',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 24,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 25,
    //   member_id: '아이디25',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 26,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 27,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 28,
    //   member_id: '아이디28',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 29,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 30,
    //   member_id: '아이디15',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
    // {
    //   id: 31,
    //   member_id: '아이디31',
    //   uri: '1',
    //   likes: 125,
    //   replys: 15,
    //   contents:
    //     '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
    //   joinDate: '2021.07.31',
    // },
  ];

  const fetchFeedData = () => {
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
      .then(feedData => {
        setData([...feedData]);
        setRefreshing(false);
        setLoading(false);
      })
      .catch(e => {
        // dispatch(dialogError(e));
        if (page > 1) {
          setData(d => [...d, ...k]);
        } else {
          setData([...k]);
        }
        setRefreshing(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (navigation.isFocused()) {
      listRef.current?.scrollToOffset({y: 0, animated: false});
      if (route.params.member_id) {
        setPage(1);
        fetchFeedData();
      } else {
        setPage(1);
        fetchFeedData();
      }
    }
    setData([]);
  }, [route.params?.member_id]);

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
    const modifiedList = data.map(element => {
      if (element.id === feed_idx) {
        const idx = element.likeMemberList.indexOf(user.member_idx);
        if (idx === -1) {
          element.likeMemberList.push(user.member_idx);
        } else {
          element.likeMemberList.splice(idx, 1);
        }
      }
      return element;
    });
    setData(modifiedList);
    fillHeart();
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

  const handleRefresh = () => {
    setRefreshing(true);
    setData([]);
    setPage(1);
    fetchFeedData();
  };

  const onEndReached = e => {
    if (!loading && e.distanceFromEnd > 0) {
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

  const keyExtractor = useCallback(
    (item, index) => item.id.toString() + index.toString(),
    [],
  );

  const renderFooter = () => {
    if (data.length === 0 || !loading) {
      return <></>;
    } else {
      return (
        <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            marginTop: 50,
            marginBottom: 50,
          }}
          color={colors.primary}
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
          onPress: () =>
            navigation.navigate(routes.feedBookUser, {
              timeKey: Date.now(),
              member_id: user.member_id,
              platform_type: user.platform_type,
            }),
        },
      }}>
      <FlatList
        initialNumToRender={12}
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
