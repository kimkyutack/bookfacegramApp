import React, { useEffect, useState} from 'react';
import {
  SafeAreaView,
} from 'react-native';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import { fetchGet} from '../../services/network';
import { FeedShareItem } from './FeedShareItem';

export default function FeedBookShare({ route, navigation }) {
  const [feeditem,setFeedItem] = useState([]);
  const fetchFeedData = () => {
   fetchGet({
    url: consts.apiUrl + '/share/feed',
    query: {
      feedIdx: route.params.feedIdx,
    },
  })
    .then(data => {
      if (data.status === 'SUCCESS') {
        console.log(data.data?.myFeedBook);
        setFeedItem(data.data?.myFeedBook);
      }
    })
    .catch(error => {

    });
  };

  useEffect(() => {
    let mount = true;
    if (mount) {
      fetchFeedData();
    }
    return () => {
      mount = false;
    };
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <FeedShareItem
        feeditem={feeditem}
        index={index}
      />
    </SafeAreaView>
  );
}
