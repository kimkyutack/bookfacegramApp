import React, {useEffect, useState} from 'react';
import {FlatList, View, Image, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {dialogOpenSelect} from '../../redux/dialog/DialogActions';
import {requestGet} from '../../services/network';
import NoticeItem from './NoticeItem';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
} from '../../services/util';

export default function Notice({route, navigation}) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    requestGet({url: consts.apiUrl + '/mypage/noticeList'})
      .then(x => {
        setData([...x.data?.noticeList]);
      })
      .catch(e => {
        // console.log(e);
        // dispatch(dialogError(e));
      });
  }, []);

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
        data={data}
        keyExtractor={(item, index) => {
          return item.title + index.toString();
        }}
        renderItem={({item, index}) => {
          return <NoticeItem {...item} isFocused={isFocused} />;
        }}
      />
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
});
