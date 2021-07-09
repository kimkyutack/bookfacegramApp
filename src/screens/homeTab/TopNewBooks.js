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
import images from '../../libs/image';
import TopNewBooksMain from './TopNewBooksMain';
import TopNewBooksDetail from './TopNewBooksDetail';
import TopNewBooksList from './TopNewBooksList';

export default function TopNewBooks({route, navigation}) {
  const [loading, setLoading] = useState(false);
  const [newBookList, setNewBookList] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [kbsBookList1, setKbsBookList1] = useState([]); //1급
  const [kbsBookList2, setKbsBookList2] = useState([]); //2급
  const [kbsBookList3, setKbsBookList3] = useState([]); //3급
  const [kbsBookList4, setKbsBookList4] = useState([]); //4급
  const [kbsBookList5, setKbsBookList5] = useState([]); //5급
  const [kbsBookList6, setKbsBookList6] = useState([]); //6급
  const [tabs, setTabs] = useState(0); // 0 book main 1 book list 2 book detail
  const [grade, setGrade] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null); // book detail page arg: book_cd
  const [th, setTh] = useState('18');

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const books = await requestGet({
        url: consts.apiUrl + '/bookList',
      });
      setNewBookList([...books.newBook]);
      // setKbsBookList([...books.kbsBook]);
      setKbsBookList1(
        [...books.kbsBook].filter(
          x => x.recomm_grade === '1급' || x.recomm_grade === '준1급',
        ),
      );
      setKbsBookList2(
        [...books.kbsBook].filter(
          x => x.recomm_grade === '2급' || x.recomm_grade === '준2급',
        ),
      );
      setKbsBookList3(
        [...books.kbsBook].filter(
          x => x.recomm_grade === '3급' || x.recomm_grade === '준3급',
        ),
      );
      setKbsBookList4(
        [...books.kbsBook].filter(
          x => x.recomm_grade === '4급' || x.recomm_grade === '준4급',
        ),
      );
      setKbsBookList5(
        [...books.kbsBook].filter(
          x => x.recomm_grade === '5급' || x.recomm_grade === '준5급',
        ),
      );
      setKbsBookList6(
        [...books.kbsBook].filter(x => x.recomm_grade === '누리급'),
      );
      setBannerList([
        {id: 1, title: images.bannerOne},
        {id: 2, title: images.bannerTwo},
      ]);
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
    if (
      newBookList.length > 0 &&
      bannerList.length > 0 &&
      kbsBookList1.length > 0 &&
      kbsBookList2.length > 0 &&
      kbsBookList3.length > 0 &&
      kbsBookList4.length > 0 &&
      kbsBookList5.length > 0 &&
      kbsBookList6.length > 0
    ) {
      setLoading(false);
    }
  }, [
    newBookList,
    bannerList,
    kbsBookList1,
    kbsBookList2,
    kbsBookList3,
    kbsBookList4,
    kbsBookList5,
    kbsBookList6,
  ]);

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
          kbsBookList1={kbsBookList1}
          kbsBookList2={kbsBookList2}
          kbsBookList3={kbsBookList3}
          kbsBookList4={kbsBookList4}
          kbsBookList5={kbsBookList5}
          kbsBookList6={kbsBookList6}
          bannerList={bannerList}
          setTabs={setTabs}
          setGrade={setGrade}
          setSelectedBook={setSelectedBook}
          th={th}
          setTh={setTh}
        />
      ) : tabs === 1 ? (
        <TopNewBooksList
          BookList={
            grade === null
              ? newBookList
              : grade === '1급'
              ? kbsBookList1
              : grade === '2급'
              ? kbsBookList2
              : grade === '(준)3급'
              ? kbsBookList3
              : grade === '(준)4급'
              ? kbsBookList4
              : grade === '(준)5급'
              ? kbsBookList5
              : grade === '누리급'
              ? kbsBookList6
              : []
          }
          setTabs={setTabs}
          grade={grade}
          setSelectedBook={setSelectedBook}
          th={th}
          gradeStyle={
            grade === null
              ? null
              : grade === '1급'
              ? {color: colors.st1}
              : grade === '2급'
              ? {color: colors.st2}
              : grade === '(준)3급'
              ? {color: colors.st3}
              : grade === '(준)4급'
              ? {color: colors.st4}
              : grade === '(준)5급'
              ? {color: colors.st5}
              : grade === '누리급'
              ? {color: colors.st6}
              : null
          }
        />
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
