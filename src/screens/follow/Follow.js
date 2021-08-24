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

import {FollowItem} from './FollowItem';

export default function Follow({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([
    {id: 1, member_id: 'sdf', platform_type: 'kakao', status: true, uri: ''},
  ]);
  const [tabIndex, setTabIndex] = useState(0); // 0 계정 1 해시태그

  useEffect(() => {
    if (route.params.type === 'follower') {
      setTabIndex(0);
    } else {
      setTabIndex(1);
    }
  }, [route.params?.timeKey]);

  useEffect(() => {
    if (tabIndex === 0) {
      // fetchUserData();
      setData([
        {
          id: 1,
          member_id: '팔로워1',
          member_idx: 1,
          platform_type: 'kakao',
          status: false,
          uri: '',
        },
        {
          id: 2,
          member_id: '팔로워2',
          member_idx: 2,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 3,
          member_id: '팔로워3',
          member_idx: 3,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 4,
          member_id: '팔로워4',
          member_idx: 4,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 5,
          member_id: '팔로워5',
          member_idx: 5,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 6,
          member_id: '팔로워6',
          member_idx: 6,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 7,
          member_id: '팔로워7',
          member_idx: 7,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 8,
          member_id: '팔로워8',
          member_idx: 8,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 9,
          member_id: '팔로워9',
          member_idx: 9,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 10,
          member_id: '팔로워10',
          member_idx: 10,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 11,
          member_id: '팔로워11',
          member_idx: 11,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
        {
          id: 12,
          member_id: '팔로워12',
          member_idx: 12,
          platform_type: 'toaping',
          status: false,
          uri: '',
        },
      ]);
    } else {
      // fetchWholeData();
      setData([
        {
          id: 1,
          member_id: '팔로우1',
          member_idx: 1,
          platform_type: 'app',
          status: true,
          uri: '',
        },
        {
          id: 2,
          member_id: '팔로우2',
          member_idx: 2,
          platform_type: 'facegram',
          status: false,
          uri: '',
        },
      ]);
    }
  }, [tabIndex]);

  return (
    <RootLayout
      topbar={{
        title:
          user.member_id?.split('@')[0]?.length > 12
            ? user.member_id?.split('@')[0]?.substring(0, 12) + '...'
            : user.member_id?.split('@')[0],
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
              member_idx: user.member_idx,
              platform_type: user.platform_type,
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
        dataPin={[10, 25]}
      />
      <View style={styles.itemContainer}>
        <FlatList
          data={data}
          extraData={data}
          keyExtractor={(item, index) =>
            item.memberId + '' + item.userId + index
          }
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
                  navigation.navigate(routes.feedBookUser, {
                    timeKey: Date.now(),
                    member_id: item.member_id,
                    member_idx: item.member_idx,
                    platform_type: item.platform_type,
                    uri: item.uri,
                    status: item.status,
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
