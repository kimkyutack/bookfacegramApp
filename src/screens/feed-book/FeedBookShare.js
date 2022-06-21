import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import { fetchGet } from '../../services/network';
import { FeedShareItem } from './FeedShareItem';

export default function FeedBookShare({ route, navigation }) {
  const [feeditem, setFeedItem] = useState([]);

  const fetchFeedData = () => {
    fetchGet({
      url: consts.apiUrl + '/share/feed',
      query: {
        feedIdx: route.params.params.feedIdx,
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
  }, []);


  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView>
        {feeditem !== undefined && feeditem && feeditem.length !== 0 &&
          <FeedShareItem
            feeditem={feeditem}
          />
        }
      </ScrollView>
    </SafeAreaView>
  );
}
