import React, {useEffect, useState} from 'react';
import {FlatList, View, Image, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {dialogError} from '../../redux/dialog/DialogActions';
import {requestGet} from '../../services/network';
import NoticeItem from './NoticeItem';
import routes from '../../libs/routes';
import images from '../../libs/images';

export default function Notice({navigation}) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    requestGet({url: consts.apiUrl + '/noticeList'})
      .then(x => {
        // console.log(x);
        setData([...x.noticeList]);
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
          name: 'camera',
          component: <Image style={styles.cameraIcon} source={images.camera} />,
          onPress: () =>
            navigation.navigate(routes.cameraRollPicker, {
              route: routes.message,
              dataKey: 'image',
              key: Date.now(),
            }),
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
        disableVirtualization={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return <NoticeItem {...item} index={index} />;
        }}
      />
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  cameraIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
