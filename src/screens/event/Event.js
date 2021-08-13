import React, {useEffect, useState} from 'react';
import {FlatList, View, Image, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import consts from '../../libs/consts';
import {requestGet} from '../../services/network';
import EventItem from './EventItem';
import images from '../../libs/images';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
} from '../../services/util';
import {dialogOpenSelect} from '../../redux/dialog/DialogActions';
export default function Event({navigation}) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    requestGet({url: consts.apiUrl + '/eventList'})
      .then(x => {
        // console.log(x);
        setData([...x.event]);
      })
      .catch(e => {
        // console.log(e);
        // dispatch(dialogError(e));
      });
  }, []);

  return (
    <RootLayout
      topbar={{
        title: '이벤트',
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
      {/* <View
        style={{
          borderBottomColor: colors.borderLine,
          borderBottomWidth: 1,
        }}
      /> */}
      <FlatList
        data={data}
        disableVirtualization={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return <EventItem item={item} navigation={navigation} />;
        }}
      />
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
