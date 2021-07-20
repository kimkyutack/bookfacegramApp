import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {dialogError} from '../../redux/dialog/DialogActions';
import {requestGet} from '../../services/network';
import EventItem from './EventItem';

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
        options: 'camera',
        navigation: navigation,
        back: true,
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
