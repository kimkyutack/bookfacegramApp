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

export default function DrawerCustom(props) {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);

  return (
    <View style={styles.root}>
      <View style={styles.userInfoContainer}>
        <View style={styles.avator}>
          <Avatar
            size={84}
            style={styles.avator}
            path={
              user?.profile_path
                ? user?.profile_path
                : 'https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp'
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

      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContainer}>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ공지사항"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('notice');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ이벤트"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('event');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ책 서랍"
              labelStyle={styles.label}
              onPress={() => {
                // props.navigation.navigate('home');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ피드북"
              labelStyle={styles.label}
              onPress={() => {
                // props.navigation.navigate('topNewBooks');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ북핑스토어"
              labelStyle={styles.label}
              onPress={() => {
                // props.navigation.navigate('topMyBooks');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ개인정보수정"
              labelStyle={styles.label}
              onPress={() => {
                // props.navigation.navigate('topActivity');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ도움말"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('tab');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ앱설정"
              labelStyle={styles.label}
              onPress={() => {
                // props.navigation.navigate('tab');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ로그아웃"
              labelStyle={styles.label}
              onPress={() => {
                dispatch(userSignOut(user.memberId));
              }}
            />
          </View>
        </View>
      </DrawerContentScrollView>
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
    height: heightPercentage(170),
  },
  itemList: {},
  avator: {
    marginTop: 15,
    marginLeft: 10,
  },
  avatorTextContainer: {marginLeft: 15, flexDirection: 'row'},
  avatorText: {
    marginTop: 20,
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
