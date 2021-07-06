import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import {requestGet, requestPost} from '../../services/network';
import {navigationRef, reset} from '../../services/navigation';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import TopNewBooksMain from './TopNewBooksMain';
import TopNewBooksDetail from './TopNewBooksDetail';
import TopNewBooksList from './TopNewBooksList';

export default function TopNewBooks({route, navigation}) {
  const [newBookList, setNewBookList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [th, setTh] = useState('18');
  const [tabs, setTabs] = useState(0); // 0 book main 1 book list 2 book detail
  const [selectedBook, setSelectedBook] = useState(null);
  const fetchRequested = async () => {
    try {
      setLoading(true);
      const books = await requestGet({
        url: consts.apiUrl + '/bookList',
      });
      setNewBookList([...books.newBook]);
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

  useEffect(() => {
    const backAction = () => {
      setTabs(0);
      return true;
    };
    if (tabs === 1 || tabs === 2) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [tabs]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      setTabs(0);
    });
    // swipe init
    // navigation.addListener('focus', e => {
    //   setTabs(0);
    // });
    return unsubscribe;
  }, [navigation]);

  const onPressNewBookList = () => {
    setTabs(1);
  };

  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{alignSelf: 'center', marginBottom: 60}}
          color={colors.primary}
        />
      ) : tabs === 0 ? (
        <TopNewBooksMain
          newBookList={newBookList}
          onPressNewBookList={onPressNewBookList}
          setTabs={setTabs}
          setSelectedBook={setSelectedBook}
          th={th}
        />
      ) : tabs === 1 ? (
        <TopNewBooksList newBookList={newBookList} />
      ) : (
        <TopNewBooksDetail selectedBook={selectedBook} />
      )}
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
});
