import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  requestGet,
  requestPut,
  requestPost,
  requestDelete,
} from '../../services/network';
import Avatar from '../../components/avatar/Avatar';
import {
  dialogActionType,
  dialogOpenAction,
  dialogOpenSelect,
} from '../../redux/dialog/DialogActions';
import {followUpdate} from '../../redux/book/BookActions';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
} from '../../services/util';
import routes from '../../libs/routes';
import Tabs from '../../components/tabs/Tabs';
import consts from '../../libs/consts';
import {FollowItem} from './FollowItem';

export default function Follow({route, navigation}) {
  const user = useSelector(s => s.user);
  const {followerCnt, followingCnt} = useSelector(s => s.book);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0); // 0 계정 1 해시태그

  const fetchFeedData = type => {
    setLoading(true);
    if (type === 'follower') {
      requestGet({
        url: consts.apiUrl + '/mypage/feedBook/follow/follower',
        query: {
          memberIdx: route.params?.memberIdx,
        },
      })
        .then(res => {
          if (res.status === 'SUCCESS') {
            setData(res.data?.feedFollower);
          } else if (res.status === 'FAIL') {
            // error 일때 해야함
          } else {
          }
          setLoading(false);
        })
        .catch(error => {
          // error 일때 해야함
          setLoading(false);
        });
    } else {
      requestGet({
        url: consts.apiUrl + '/mypage/feedBook/follow/following',
        query: {
          memberIdx: route.params?.memberIdx,
        },
      })
        .then(res => {
          if (res.status === 'SUCCESS') {
            setData(res.data?.feedFollowing);
          } else if (res.status === 'FAIL') {
            // error 일때 해야함
          } else {
          }
          setLoading(false);
        })
        .catch(error => {
          // error 일때 해야함')
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (tabIndex === 0) {
      fetchFeedData('follower');
    } else {
      fetchFeedData('follow');
    }
  }, [tabIndex]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      if (route.params?.type === 'follower') {
        setTabIndex(0);
        fetchFeedData('follower');
      } else {
        setTabIndex(1);
        fetchFeedData('follow');
      }
    }
    return () => {
      mount = false;
    };
  }, [route.params?.key, followerCnt, followingCnt]);

  const deleteFollwer = (memberId, followerIdx) => {
    dispatch(
      dialogOpenAction({
        titleColor: '#2699fb',
        cancelTitle: '취소',
        message: `${memberId}님을 팔로워 삭제하시겠습니까?`,
        onPress: a => {
          if (a) {
            requestPut({
              url:
                consts.apiUrl +
                `/mypage/feedBook/follow/follower/${followerIdx}`,
            })
              .then(res => {
                if (res.status === 'SUCCESS') {
                  dispatch(
                    followUpdate(
                      res.data?.followerCnt,
                      res.data?.followerList,
                      res.data?.followingCnt,
                      res.data?.followingList,
                    ),
                  );
                } else if (res.status === 'FAIL') {
                  // error 일때 해야함
                  dispatch('fail');
                } else {
                }
              })
              .catch(error => {
                dispatch(error);
                // error 일때 해야함
              });
          }
        },
      }),
    );
  };

  const deleteFollwing = (memberId, followingIdx, memberIdx) => {
    dispatch(
      dialogOpenAction({
        titleColor: '#2699fb',
        cancelTitle: '취소',
        message: `${memberId}님을 팔로잉 취소하시겠습니까?`,
        onPress: a => {
          if (a) {
            requestDelete({
              url:
                consts.apiUrl +
                `/mypage/feedBook/follow/following/${followingIdx}`,
              query: {
                following_member_idx: memberIdx,
              },
            })
              .then(res => {
                if (res.status === 'SUCCESS') {
                  dispatch(
                    followUpdate(
                      res.data?.followerCnt,
                      res.data?.followerList,
                      res.data?.followingCnt,
                      res.data?.followingList,
                    ),
                  );
                } else if (res.status === 'FAIL') {
                  // error 일때 해야함
                  dispatch('fail');
                } else {
                }
              })
              .catch(error => {
                dispatch(error);

                // error 일때 해야함
              });
          }
        },
      }),
    );
  };

  return (
    <RootLayout
      topbar={{
        title:
          route.params?.memberId?.split('@')[0]?.length > 10
            ? route.params?.memberId?.split('@')[0]?.substring(0, 10) + '...'
            : route.params?.memberId?.split('@')[0],
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
          component: (
            <Image style={styles.cameraIcon} source={images.feedCamera} />
          ),
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
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
              }
            />
          ),
          name: 'avator',
          onPress: () =>
            navigation.navigate(routes.feedBookImage, {
              screen: routes.feedBookUserImage,
              params: {
                memberId: user.member_id,
                memberIdx: user.member_idx,
                profile_path:  user?.profile_path
                  ? user?.profile_path
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png',
                key: Date.now(),
              },
            }),
        },
      }}>
      <View
        style={{
          borderBottomColor: colors.borderLine,
          borderBottomWidth: 1,
        }}
      />
      <Tabs
        style={styles.tabs}
        index={tabIndex}
        onIndexChange={t => {
          if (tabIndex !== t) {
            setData([]);
          }
          setTabIndex(t);
        }}
        data={['팔로워', '팔로우']}
        // user 의 팔로워, 팔로우 숫자
        dataPin={[followerCnt || 0, followingCnt || 0]}
      />
      <View style={styles.itemContainer}>
        <FlatList
          data={data}
          extraData={data}
          keyExtractor={(item, index) => {
            return item.memberId + '' + item.userId + index;
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading && (
              <ActivityIndicator
                size="large"
                style={{
                  alignSelf: 'center',
                  marginTop: 20,
                  marginBottom: 150,
                }}
                color={colors.blue}
              />
            )
          }
          renderItem={({item, index}) => {
            return (
              <FollowItem
                {...item}
                onPress={() =>
                  navigation.navigate(routes.feedBookImage, {
                    screen: routes.feedBookUserImage,
                    params: {
                      memberId: item.memberId,
                      memberIdx: item.memberIdx,
                      profile_path:  item.profile
                      ? item.profile
                      : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png',
                      key: Date.now(),
                    },
                  })
                }
                tabIndex={tabIndex}
                index={index}
                deleteFollwer={deleteFollwer}
                deleteFollwing={deleteFollwing}
                myInfo={route.params?.myInfo}
              />
            );
          }}
        />
      </View>
      <Footer />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: heightPercentage(20),
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
});
