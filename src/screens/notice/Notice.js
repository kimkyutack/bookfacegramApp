import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch} from 'react-redux';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import {dialogError} from '../../redux/dialog/DialogActions';
import {goBack} from '../../services/navigation';
import {requestGet} from '../../services/network';
import NoticeItem from './NoticeItem';

export default function Notice({navigation}) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    requestGet({url: consts.apiUrl + '/noticeList'})
      .then(x => {
        console.log(x);
        setData([...x.noticeList]);
      })
      .catch(e => {
        console.log(e);
        // dispatch(dialogError(e));
      });
  }, []);

  return (
    <RootLayout
      topbar={{
        title: '공지사항',
        options: 'camera',
        navigation: navigation,
        back: true,
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
