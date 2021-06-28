import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import SnapCarousel from '../../components/snap-carousel/SnapCarousel';
import BookItem from './Bookitem';
import {requestGet, requestPost} from '../../services/network';
import {screenHeight, screenWidth} from '../../services/util';
import consts from '../../libs/consts';
import axios from 'axios';

export default function TopNewBooks({}) {
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const books = await requestGet({
        url: consts.apiUrl + '/newBookListJson',
      });

      // console.log(books.payLoad);
      setBookList([...books.payLoad]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    fetchRequested();
  }, []);

  const onEndReached = () => {
    if (loading) {
      return;
    } else {
      fetchRequested();
    }
  };
  return (
    <View style={styles.root}>
      <SnapCarousel name="mainCarousel" />
      <View style={styles.newBookList}>
        {/* <FlatList
          data={bookList}
          // keyExtractor={item => String(item.BOOK_CD)}
          keyExtractor={(item, index) => item.id + '_' + index}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.8}
          initialNumToRender={10}
          renderItem={({item, index}) => {
            return (
              <BookItem
                {...item}
                index={index}
                onPress={() => {
                  // navigate(routes.profile, {userId: item.userId});
                }}
              />
            );
          }}
        /> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  newBookList: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
});
