import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import colors from '../../libs/colors';
import images from '../../libs/images';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  fontPercentage,
} from '../../services/util';
import {navigationRef} from '../../services/navigation';

import Avatar from '../../components/avatar/Avatar';
import TextWrap from '../../components/text-wrap/TextWrap';
import Topbar from '../../components/topbar/Topbar';
import {dialogOpenSelect} from '../../redux/dialog/DialogActions';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import FeedTopTabs from './FeedTopTabs';

export default function FeedBookImage({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const {currentUserId, profilePath, followerCnt, followingCnt, totalCnt} =
    useSelector(s => s.book);
  const dispatch = useDispatch();
  const [myInfo, setMyInfo] = useState(true);

  const [followerCount, setFollowerCount] = useState(followerCnt);
  const [followingCount, setFollowingCount] = useState(followingCnt);
  const [totalCount, setTotalCount] = useState(totalCnt);
  const [userProfilePath, setUserProfilePath] = useState(profilePath);
  const [userCurrentUserId, setUserCurrentUserId] = useState(currentUserId);

  useEffect(() => {
    if (route.params?.params?.memberIdx === user.member_idx) {
      setMyInfo(true);
    } else {
      setMyInfo(false);
    }
  }, [route.params?.params?.key]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      setFollowerCount(followerCnt);
      setFollowingCount(followingCnt);
      setTotalCount(totalCnt);
      setUserProfilePath(profilePath);
      setUserCurrentUserId(currentUserId);
    }
    return () => {
      mount = false;
    };
  }, [currentUserId, profilePath, followerCnt, followingCnt, totalCnt]);

  return (
    <SafeAreaView style={styles.safeView}>
      <Topbar
        title={
          userCurrentUserId
            ? userCurrentUserId?.split('@')[0]?.length > 12
              ? userCurrentUserId?.split('@')[0]?.substring(0, 12) + '...'
              : userCurrentUserId?.split('@')[0]
            : '피드북'
        }
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
          component: <Image style={styles.cameraIcon} source={images.search} />,
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
                  : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
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
      <View style={styles.root}>
        {navigationRef.current.getCurrentRoute()?.name !==
          routes.feedBookFeed && (
          <View style={styles.infoContainer}>
            <Avatar
              size={widthPercentage(65)}
              style={styles.avator}
              path={
                userProfilePath
                  ? userProfilePath
                  : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
              }
            />
            {!myInfo && (
              <ButtonWrap
                style={
                  route.params?.params?.status
                    ? styles.status
                    : styles.statusOutline
                }
                styleTitle={route.params?.params?.status && styles.statusTitle}
                outline={!route.params?.params?.status && true}>
                {route.params?.params?.status ? '팔로잉' : '팔로우'}
              </ButtonWrap>
            )}
            <View style={[styles.info, {marginLeft: widthPercentage(60)}]}>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>
                {totalCount ? totalCount : 0}
              </TextWrap>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>게시물</TextWrap>
            </View>
            <TouchableOpacity
              style={styles.info}
              onPress={() =>
                navigation.navigate(routes.follow, {
                  memberId: userCurrentUserId,
                  memberIdx: route.params?.params.memberIdx,
                  followerCnt: followerCount,
                  followingCnt: followingCount,
                  type: 'follower',
                })
              }>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>
                {followerCount ? followerCount : 0}
              </TextWrap>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>팔로워</TextWrap>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.info, {marginRight: widthPercentage(43.6)}]}
              onPress={() =>
                navigation.navigate(routes.follow, {
                  memberId: userCurrentUserId,
                  memberIdx: route.params?.params.memberIdx,
                  followerCnt: followerCount,
                  followingCnt: followingCount,
                  type: 'follow',
                })
              }>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>
                {followingCount ? followingCount : 0}
              </TextWrap>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>팔로잉</TextWrap>
            </TouchableOpacity>
          </View>
        )}

        <FeedTopTabs route={route} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  root: {
    flex: 1,
  },
  infoContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    marginTop: 10,
  },

  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  status: {
    position: 'absolute',
    bottom: 0,
    left: widthPercentage(60),
    width: widthPercentage(42),
    height: heightPercentage(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006fff',
  },
  statusOutline: {
    position: 'absolute',
    bottom: 0,
    left: widthPercentage(60),
    width: widthPercentage(42),
    height: heightPercentage(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    color: colors.white,

    fontSize: fontPercentage(10),
    lineHeight: fontPercentage(19),
  },
});
