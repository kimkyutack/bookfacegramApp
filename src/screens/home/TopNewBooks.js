import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {requestGet, requestPost} from '../../services/network';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import TopNewBooksMain from './home-main/TopNewBooksMain';
import TopNewBooksList from './home-list/TopNewBooksList';
import TopNewBooksDetail from './home-detail/TopNewBooksDetail';
import {dialogOpenAction, dialogError} from '../../redux/dialog/DialogActions';

export default function TopNewBooks({route}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [bookList, setBookList] = useState();

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const books = await requestGet({
        url: consts.apiUrl + '/bookList',
      });
      setBookList(books);
    } catch (error) {
      setLoading(false);
      dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    fetchRequested();
  }, []);

  useEffect(() => {
    if (bookList) {
      setLoading(false);
    }
  }, [bookList]);

  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{alignSelf: 'center', marginBottom: 60}}
          color={colors.blue}
        />
      ) : route.params.type === 'main' ? (
        <TopNewBooksMain route={route} key={Date.now()} bookList={bookList} />
      ) : route.params.type === 'list' ? (
        <TopNewBooksList route={route} key={Date.now()} bookList={bookList} />
      ) : route.params.type === 'detail' ? (
        <TopNewBooksDetail route={route} key={Date.now()} />
      ) : (
        <></>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
