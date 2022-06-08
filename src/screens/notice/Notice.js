import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import { dialogOpenSelect } from '../../redux/dialog/DialogActions';
import { requestGet } from '../../services/network';
import NoticeItem from './NoticeItem';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
  screenWidth,
} from '../../services/util';
import { navigate } from '../../services/navigation';

export default function Notice({ route, navigation }) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const listRef = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requestGet({ url: consts.apiUrl + '/mypage/noticeList' })
        .then(x => {
          setData([...x.data?.noticeList]);
        })
        .catch(e => {
          // console.log(e);
          // dispatch(dialogError(e));
        });
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <RootLayout
      topbar={{
        title: '공지사항',
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
      }}>
      <View
        style={{
          borderBottomColor: colors.borderLine,
          borderBottomWidth: 1,
        }}
      />
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item, index) => {
          return item.title + index.toString();
        }}
        renderItem={({ item, index }) => {
          return <NoticeItem {...item} isFocused={isFocused} />;
        }}
        onScroll={event => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
      />
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listRef.current.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
      )}
      <Footer page="notice" />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: heightPercentage(65),
    left: screenWidth / 2.2,
    display: 'flex',
  },
});
