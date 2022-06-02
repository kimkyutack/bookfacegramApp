import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, Image, StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import consts from '../../libs/consts';
import { requestGet } from '../../services/network';
import EventItem from './EventItem';
import images from '../../libs/images';
import Footer from '../../libs/footer';
import {
  widthPercentage,
  heightPercentage,
  cameraItem,
} from '../../services/util';
import { dialogOpenSelect } from '../../redux/dialog/DialogActions';
import { navigate } from '../../services/navigation';
export default function Event({ navigation }) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requestGet({ url: consts.apiUrl + '/mypage/eventList' })
        .then(x => {
          setData([...x.data?.event]);
        })
        .catch(e => {
          // dispatch(dialogError(e));
        });
    });

    return unsubscribe;
  }, [navigate]);

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
      {data.length === 0 ? (<View style={styles.root}>
        <Text style={{ marginTop: 10 }}>현재 진행중인 이벤트가 없습니다.</Text>
      </View>) :
        <FlatList
          data={data}
          disableVirtualization={false}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item, index }) => {
            return <EventItem item={item} navigation={navigation} />;
          }}
        />
      }
      <Footer page="event" />
    </RootLayout >
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
});
