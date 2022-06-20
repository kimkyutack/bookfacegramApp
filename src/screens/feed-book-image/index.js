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
import Footer from '../../libs/footer';
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
import {
  dialogError,
  dialogOpenSelect,
  dialogOpenAction,
} from '../../redux/dialog/DialogActions';
import {followUpdate} from '../../redux/book/BookActions';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import FeedTopTabs from './FeedTopTabs';
import {requestPost} from '../../services/network';

export default function FeedBookImage({route, navigation}) {
  const user = useSelector(s => s.user, shallowEqual);
  const {
    currentUserId,
    profilePath,
    followerCnt,
    followingCnt,
    followerList,
    followingList,
    totalCnt,
    official,
  } = useSelector(s => s.book);
  const dispatch = useDispatch();
  const [myInfo, setMyInfo] = useState(true);
  const [myFollowing, setMyFollowing] = useState(true);

  const [stateFollowerCount, setStateFollowerCount] = useState(followerCnt);
  const [stateFollowingCount, setStateFollowingCount] = useState(followingCnt);
  const [stateFollowerList, setStateFollowerList] = useState(followerList);
  const [stateFollowingList, setStateFollowingList] = useState(followingList);
  const [totalCount, setTotalCount] = useState(totalCnt);
  const [userProfilePath, setUserProfilePath] = useState(profilePath);
  const [userCurrentUserId, setUserCurrentUserId] = useState(currentUserId);
  useEffect(() => {
    if (route.params?.params?.memberIdx === user.member_idx || official === 1) {
      setMyInfo(true);
    } else {
      setMyInfo(false);
    }
  }, [route.params?.params?.key, official]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      setStateFollowerCount(followerCnt);
      setStateFollowingCount(followingCnt);
      setStateFollowerList(followerList);
      setStateFollowingList(followingList);
      setTotalCount(totalCnt);
      setUserProfilePath(profilePath);
      setUserCurrentUserId(currentUserId);
      if (followerList && followerList.indexOf(user.member_idx) !== -1) {
        setMyFollowing(true);
      } else {
        setMyFollowing(false);
      }
    }
    return () => {
      mount = false;
    };
  }, [
    currentUserId,
    profilePath,
    followerCnt,
    followingCnt,
    followerList,
    followingList,
    totalCnt,
  ]);

  const requestFollowing = member_idx => {
    requestPost({
      url: consts.apiUrl + '/mypage/feedBook/follow/following',
      body: {
        followingMemberIdx: member_idx,
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
          dispatch(dialogError('fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
        // error 일때 해야함
      });
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <Topbar
        title={
          (route.params.screen === 'feedBookUserImage' && route.params.params.memberId && route.params.params.noname === undefined)
            ? route.params.params.memberId.length > 12
              ? route.params.params.memberId.substring(0, 12) + '...'
              : route.params.params.memberId
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
                profile_path:  user?.profile_path
                  ? user?.profile_path
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png',
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
                route.params.params.profile_path
                  ? route.params.params.profile_path
                  : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
              }
            />
            {!myInfo && (
              <ButtonWrap
                style={myFollowing ? styles.status : styles.statusOutline}
                styleTitle={myFollowing && styles.statusTitle}
                onPress={() =>
                  !myFollowing &&
                  dispatch(
                    dialogOpenAction({
                      titleColor: '#2699fb',
                      cancelTitle: '취소',
                      message: `${userCurrentUserId}님을 팔로잉 하시겠습니까?`,
                      onPress: a => {
                        if (a) {
                          requestFollowing(route.params?.params?.memberIdx);
                        }
                      },
                    }),
                  )
                }
                outline>
                팔로우
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
                  type: 'follower',
                  myInfo:
                    route.params?.params?.memberIdx === user.member_idx
                      ? true
                      : false,
                  key: Date.now(),
                })
              }>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>
                {stateFollowerCount ? stateFollowerCount : 0}
              </TextWrap>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>팔로워</TextWrap>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.info, {marginRight: widthPercentage(43.6)}]}
              onPress={() =>
                navigation.navigate(routes.follow, {
                  memberId: userCurrentUserId,
                  memberIdx: route.params?.params.memberIdx,
                  type: 'follow',
                  myInfo:
                    route.params?.params?.memberIdx === user.member_idx
                      ? true
                      : false,
                  key: Date.now(),
                })
              }>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>
                {stateFollowingCount ? stateFollowingCount : 0}
              </TextWrap>
              <TextWrap font={fonts.kopubWorldDotumProMedium}>팔로잉</TextWrap>
            </TouchableOpacity>
          </View>
        )}

        <FeedTopTabs route={route} />
      </View>
      <Footer page="feed" />
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
