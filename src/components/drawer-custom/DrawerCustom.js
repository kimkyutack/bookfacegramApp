import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {userSignOut} from '../../redux/user/UserActions';
import routes from '../../libs/routes';
import {navigate, navigationRef, reset} from '../../services/navigation';
import Avatar from '../avatar/Avatar';
import TextWrap from '../text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import {dialogError} from '../../redux/dialog/DialogActions';

export default function DrawerCustom(props) {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);

  return (
    <View style={styles.root}>
      <View style={styles.userInfoContainer}>
        <View style={styles.avatorLeftMargin}>
          <Avatar
            size={84}
            style={styles.avator}
            path={
              user?.profile_path
                ? user?.profile_path
                : 'https://toaping.me/bookfacegram/images/menu_left/icon/toaping.png'
            }
          />
        </View>
        <View style={styles.avatorTextContainer}>
          <TextWrap
            style={styles.avatorText}
            font={fonts.kopubWorldDotumProBold}>
            {user?.kor_nm ? user?.kor_nm : 'Undefined'}{' '}
            <Text style={styles.avatorText2}>님</Text>
          </TextWrap>
        </View>
      </View>

      {/*<DrawerContentScrollView {...props}>*/}
      <View>
        <View style={styles.drawerContainer}>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ공지사항"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate(routes.notice, {idx: 0});
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ이벤트"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate(routes.event);
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ책 서랍"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate(routes.bookDrawer, {
                  timeKey: Date.now(),
                });
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ피드북"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate(routes.feedBook, {
                  timeKey: Date.now(),
                  memberId: null,
                  memberIdx: null,
                  id: null,
                });
              }}
            />
          </View>
          {/*<View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ토핑스토어"
              labelStyle={styles.label}
              onPress={() => {
                dispatch(dialogError('페이지 제작중...'));
                // props.navigation.navigate('topMyBooks');
              }}
            />
            </View>*/}
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ개인정보수정"
              labelStyle={styles.label}
              onPress={() => {
                //dispatch(dialogError('페이지 제작중...'));
                props.navigation.navigate(routes.profile, {
                  grade: '',
                  image: '',
                });
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ도움말"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate(routes.faq);
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ앱설정"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate(routes.setting);
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ로그아웃"
              labelStyle={styles.label}
              onPress={() => {
                try {
                  props.navigation.closeDrawer();
                  dispatch(userSignOut(user.member_id));
                } catch (e) {
                  dispatch(dialogError(e));
                }
              }}
            />
          </View>
        </View>
        </View>
      {/*</DrawerContentScrollView>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  drawerContainer: {},
  userInfoContainer: {
    backgroundColor: '#FED500',
    ...Platform.select({
      ios:{
        height: heightPercentage(200),
      },
      android:{
        height: heightPercentage(170),
      },
    }),
    
    justifyContent: 'center',
  },
  itemList: {},
  avatorLeftMargin: {
    ...Platform.select({
      ios:{
        marginTop: heightPercentage(30),
      },
    }),
    marginLeft: 10,
  },
  avator: {
    marginTop: 15,
    marginLeft: 10,
  },
  avatorTextContainer: {marginLeft: 15, flexDirection: 'row'},
  avatorText: {
    marginTop: heightPercentage(20),
    marginLeft: 10,
    fontSize: fontPercentage(16),
    fontFamily: fonts.kopubWorldDotumProBold,
  },
  avatorText2: {
    fontSize: fontPercentage(16),
    fontFamily: fonts.kopubWorldDotumProBold,
  },
  label: {
    color: '#000000',
    fontSize: fontPercentage(14),
    lineHeight: fontPercentage(19),
    fontFamily: fonts.kopubWorldDotumProLight,
  },
  drawerItem: {},
});
