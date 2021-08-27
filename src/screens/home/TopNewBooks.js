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
  const [newBook, setNewBook] = useState(null);
  const [kbsBook, setKbsBook] = useState(null);

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/bookList',
      });
      if (status === 'SUCCESS') {
        setNewBook([...data.newBook]);
        setKbsBook([...data.kbsBook]);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    fetchRequested().then(res => {
      if (res === 'SUCCESS') {
        setLoading(false);
      }
    });
    return () => {
      setLoading(true);
      setNewBook([]);
      setKbsBook([]);
    };
  }, []);

  return (
    <View style={styles.root}>
      {loading ? (
        <></>
      ) : !loading && route.params.type === 'main' ? (
        <TopNewBooksMain route={route} kbsBook={kbsBook} newBook={newBook} />
      ) : !loading && route.params.type === 'list' ? (
        <TopNewBooksList route={route} kbsBook={kbsBook} newBook={newBook} />
      ) : !loading && route.params.type === 'detail' ? (
        <TopNewBooksDetail route={route} />
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
