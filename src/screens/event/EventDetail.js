import React, {useEffect, useState} from 'react';
import {FlatList, Image, View, ScrollView, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {dialogError} from '../../redux/dialog/DialogActions';
import {goBack} from '../../services/navigation';
import {requestGet} from '../../services/network';
import images from '../../libs/image';

export default function EventDetail({route, navigation}) {
  const [data, setData] = useState([]);
  const dispathc = useDispatch();
  return (
    <RootLayout
      topbar={{
        title: '이벤트',
        options: 'camera',
        navigation: navigation,
        back: true,
      }}>
      <ScrollView>
        <View style={styles.root}>
          <Image
            source={
              route.params.item === 'event1_thumb.jpg'
                ? images.event1Body
                : images.event2Body
            }
            style={styles.image}
          />
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  image: {
    width: '100%',
    resizeMode: 'stretch',
  },
});
