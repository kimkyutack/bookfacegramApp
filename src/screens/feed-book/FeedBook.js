import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
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
import {dialogOpenSelect} from '../../redux/dialog/DialogActions';
import {FeedItem} from './FeedItem';

export default function FeedBook({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listRef = useRef();

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // mock data
  const k = [
    {
      id: 1,
      member_id: 'l879465213@naver.com',
      uri: '1',
      likes: 121,
      replys: 10,
      contents: '본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 2,
      member_id: '아이디2',
      uri: '2',
      likes: 122,
      replys: 12,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 3,
      member_id: '아이디3',
      uri: '3',
      likes: 123,
      replys: 13,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.다.본문 내용입.',
      joinDate: '2021.07.31',
    },
    {
      id: 4,
      member_id: '아이디4',
      uri: '4',
      likes: 124,
      replys: 14,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 5,
      member_id: '아이디5',
      uri: '5',
      likes: 125,
      replys: 15,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용',
      joinDate: '2021.07.31',
    },
    {
      id: 6,
      member_id: '아이디6',
      uri: '6',
      likes: 126,
      replys: 16,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 7,
      member_id: '아이디7',
      uri: '7',
      likes: 127,
      replys: 17,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 8,
      member_id: '아이디8',
      uri: '8',
      likes: 128,
      replys: 18,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 9,
      member_id: '아이디9',
      uri: '9',
      likes: 129,
      replys: 19,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 10,
      member_id: '아이디10',
      uri: '10',
      likes: 121,
      replys: 10,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 11,
      member_id: '아이디11',
      uri: '11',
      likes: 121,
      replys: 11,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 12,
      member_id: '아이디12',
      uri: '12',
      likes: 122,
      replys: 12,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 13,
      member_id: '아이디13',
      uri: '13',
      likes: 123,
      replys: 13,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 14,
      member_id: '아이디14',
      uri: '14',
      likes: 124,
      replys: 14,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
    {
      id: 15,
      member_id: '아이디15',
      uri: '1',
      likes: 125,
      replys: 15,
      contents:
        '본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.본문 내용입니다.',
      joinDate: '2021.07.31',
    },
  ];

  const fetchFeedData = () => {
    setLoading(true);
    requestGet({
      url: consts.apiUrl + '/users/' + user.member_id + '/friends',
      query: {
        member_id: route.params?.member_id,
        page,
        limit: limit,
      },
    })
      .then(feedData => {
        if (page > 1) {
          setData(d => [...d, ...feedData]);
        } else {
          setData([...feedData]);
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
    if (navigation.isFocused()) {
      listRef.current?.scrollToOffset({y: 0, animated: false});
      setPage(1);
      fetchFeedData();
    }
    setData([]);
  }, [route.params.timeKey]);

  useEffect(() => {
    fetchFeedData();
  }, [page]);

  const onEndReached = e => {
    if (!loading) {
      let tm = setTimeout(() => {
        clearTimeout(tm);
        setPage(p => p + 1);
      }, 1000);
    }
  };

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

  return (
    <RootLayout
      topbar={{
        title: '피드북',
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
        ref={listRef}
        data={data}
        extraData={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.title + index.toString()}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        ListFooterComponent={
          loading && (
            <ActivityIndicator
              size="large"
              style={{
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 150,
              }}
              color={colors.primary}
            />
          )
        }
        renderItem={({item, index}) => {
          return (
            <FeedItem
              {...item}
              isFocused={isFocused}
              index={index}
              login_id={user.member_id}
              editOnPress={editOnPress}
            />
          );
        }}
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
