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

export default function TopNewBooks({route}, start, end) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState([]);
  const [kbsBook, setKbsBook] = useState([]);
  const [th, setTh] = useState(18);
  const [banner, setBanner] = useState([]);
  const [drawerList, setDrawerList] = useState([]);

  if (JSON.stringify(start) === '{}') {
    start = 0;
    end = 30;
  }

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/bookList',
        query: {
          startPaging: start,
          endPaging: end,
        },
      });
      if (status === 'SUCCESS') {
        setNewBook([...data.newBook]);
        setKbsBook([...data.kbsBook.kbsBookList]);
        setTh(data.kbsBook?.seqKbs);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  const fetchRequested2 = async () => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/banner',
        query: {
          bannerGroupCode: 'banner01',
        },
      });
      if (status === 'SUCCESS') {
        setBanner([...data.banner]);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };
  useEffect(() => {
    fetchRequested().then(res => {
      fetchRequested2().then(response => {
        if (response === 'SUCCESS') {
          setLoading(false);
        } else {
          dispatch(dialogError(response || 'fail'));
        }
      });
    });

    return () => {
      setLoading(true);
      setNewBook([]);
      setKbsBook([]);
      setBanner([]);
      setTh(18);
    };
  }, []);

  return (
    <View style={styles.root}>
      {loading ? (
        <></>
      ) : !loading && route.params.type === 'main' ? (
        <TopNewBooksMain
          route={route}
          kbsBook={kbsBook}
          newBook={newBook}
          banner={banner}
          th={th}
        />
      ) : !loading && route.params.type === 'list' ? (
        <TopNewBooksList
          route={route}
          kbsBook={kbsBook}
          newBook={newBook}
          th={th}
        />
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
