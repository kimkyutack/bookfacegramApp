import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import images from '../../libs/images';
import {requestGet} from '../../services/network';
import Avatar from '../../components/avatar/Avatar';
import {dialogOpenSelect} from '../../redux/dialog/DialogActions';
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

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
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
          } else if (data.status === 'FAIL') {
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
          } else if (data.status === 'FAIL') {
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
    if (route.params.type === 'follower') {
      setTabIndex(0);
    } else {
      setTabIndex(1);
    }
  }, [isFocused]);

  useEffect(() => {
    if (tabIndex === 0) {
      fetchFeedData('follower');
    } else {
      fetchFeedData('follow');
    }
  }, [tabIndex, isFocused]);

  return (
    <RootLayout
      topbar={{
        title:
          route.params?.memberId?.split('@')[0]?.length > 12
            ? route.params?.memberId?.split('@')[0]?.substring(0, 12) + '...'
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
            navigation.navigate(routes.feedBookImage, {
              screen: routes.feedBookUserImage,
              params: {
                memberId: user.member_id,
                memberIdx: user.member_idx,
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
        dataPin={[
          route.params.followerCnt || 0,
          route.params.followingCnt || 0,
        ]}
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
                      key: Date.now(),
                    },
                  })
                }
                tabIndex={tabIndex}
                index={index}
              />
            );
          }}
        />
      </View>
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
