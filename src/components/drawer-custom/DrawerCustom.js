import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {navigate, navigationRef, reset} from '../../services/navigation';
import Avatar from '../avatar/Avatar';
import TextWrap from '../text-wrap/TextWrap';
export default function DrawerCustom(props) {
  return (
    <>
      <View style={styles.userInfo}>
        <View style={styles.avator}>
          <Avatar
            size={84}
            style={styles.avator}
            path="https://img.insight.co.kr/static/2021/06/04/700/img_20210604103620_zga8c04k.webp"
          />
        </View>
        <View style={{marginLeft: 15, flexDirection: 'column'}}>
          <TextWrap style={styles.avatorText}>Undefined 님</TextWrap>
        </View>
      </View>

      <DrawerContentScrollView {...props}>
        <View style={styles.container}>
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
                props.navigation.navigate('tab');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ책 서랍"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('home');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ피드북"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('topNewBooks');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ북핑스토어"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('topMyBooks');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ개인정보수정"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('topActivity');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ도움말"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('splash');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ앱설정"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('splash');
              }}
            />
          </View>
          <View style={styles.itemList}>
            <DrawerItem
              style={styles.drawerItem}
              label="ㆍ로그아웃"
              labelStyle={styles.label}
              onPress={() => {
                props.navigation.navigate('splash');
              }}
            />
          </View>
        </View>
      </DrawerContentScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    backgroundColor: '#FED500',
    height: 180,
    width: 240,
  },
  itemList: {
    height: 50,
  },
  avator: {
    marginTop: 20,
    marginLeft: 10,
  },
  avatorText: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 16,
  },
  label: {
    color: '#000000',
    fontSize: 14,
  },
  drawerItem: {
    width: 220,
  },
});
