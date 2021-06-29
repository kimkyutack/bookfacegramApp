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
  const dispathc = useDispatch();
  // useEffect(() => {
  //   requestGet({url: consts.apiUrl + '/notices'})
  //     .then((x) => {
  //       setData([...x]);
  //     })
  //     .catch((e) => {
  //       dispathc(dialogError(e));
  //       goBack();
  //     });
  // }, []);

  useEffect(() => {
    setData([
      {
        title: '북핑 공지사항1',
        createdAt: '2020-09-05',
        description: '공지공지1',
      },
      {
        title: '북핑 공지사항2',
        createdAt: '2020-09-05',
        description: '공지공지2',
      },
      {
        title: '북핑 공지사항3',
        createdAt: '2020-09-05',
        description: '공지공지3',
      },
      {
        title: '북핑 공지사항4',
        createdAt: '2020-09-05',
        description: '공지공지4',
      },
      {
        title: '북핑 공지사항5',
        createdAt: '2020-09-05',
        description: '공지공지5',
      },
    ]);
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return <NoticeItem {...item} />;
        }}
      />
    </RootLayout>
  );
}
