import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../../components/text-wrap/TextWrap';
import consts from '../../../libs/consts';
import colors from '../../../libs/colors';
import images from '../../../libs/images';
import routes from '../../../libs/routes';
import BookListItem from './BookListItem';
import TopNewBooks from '../TopNewBooks';
import {
  screenWidth,
  widthPercentage,
  heightPercentage,
} from '../../../services/util';
import {requestGet, requestPost} from '../../../services/network';
import {dialogError} from '../../../redux/dialog/DialogActions';

export default function TopNewBooksList({route, newBook, kbsBook, th, booktype}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [type, setType] = useState(booktype);
  const [start, setStart] = useState(30);
  const [morenewBook, setNewBook] = useState([]);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const [state, setState] = useState({
    req: listTab.listTab.grade === null ? newBook : kbsBook,
    page: 1,
  });
  const fetchRequested = async startpage => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/bookList',
        query: {
          startPaging: startpage,
          endPaging: 30,
        },
      });

      if (status === 'SUCCESS') {
        setStart(start + 30);
        if (listTab.listTab.grade === null) {
          setNewBook([...data.newBook]);
        } else {
          setNewBook([...data.kbsBook.kbsBookList]);
        }
      }
      return status;
    } catch (error) {
      setLoading(false);
      dispatch(dialogError(error));
    }
  };
  useEffect(() => {
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
      if (listTab.listTab.grade === null) {
        setType('new');
        setState({req: newBook, page: 1});
      } else if (listTab.listTab.grade === '1급') {
        setType('kbs');
        setState({
          req: kbsBook?.filter(x => x.grade === '1급' || x.grade === '준1급'),
          page: 1,
        });
      } else if (listTab.listTab.grade === '2급') {
        setType('kbs');
        setState({
          req: kbsBook?.filter(x => x.grade === '2급' || x.grade === '준2급'),
          page: 1,
        });
      } else if (
        listTab.listTab.grade === '3급' ||
        listTab.listTab.grade === '준3급'
      ) {
        setType('kbs');
        setState({
          req: kbsBook?.filter(x => x.grade === '3급' || x.grade === '준3급'),
          page: 1,
        });
      } else if (
        listTab.listTab.grade === '4급' ||
        listTab.listTab.grade === '준4급'
      ) {
        setType('kbs');
        setState({
          req: kbsBook?.filter(x => x.grade === '4급' || x.grade === '준4급'),
          page: 1,
        });
      } else if (
        listTab.listTab.grade === '5급' ||
        listTab.listTab.grade === '준5급'
      ) {
        setType('kbs');
        setState({
          req: kbsBook?.filter(x => x.grade === '5급' || x.grade === '준5급'),
          page: 1,
        });
      } else if (listTab.listTab.grade === '누리급') {
        setType('kbs');
        setState({
          req: kbsBook?.filter(x => x.grade === '누리급'),
          page: 1,
        });
      }
      setLoading(false);
    }
    return () => {
      mount = false;
    };
  }, [listTab.listTab.grade]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      //scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
      if (listTab.listTab.grade === null) {
        setType('new');
        setState({
          req: state.req.concat([...morenewBook]),
          page: state.page + 1,
        });
      } else if (listTab.listTab.grade === '1급') {
        setType('kbs');
        setState({
          req: state.req.concat([
            ...morenewBook?.filter(
              x => x.grade === '1급' || x.grade === '준1급',
            ),
          ]),
          page: state.page + 1,
        });
      } else if (listTab.listTab.grade === '2급') {
        setType('kbs');
        setState({
          req: state.req.concat([
            ...morenewBook?.filter(
              x => x.grade === '2급' || x.grade === '준2급',
            ),
          ]),
          page: state.page + 1,
        });
      } else if (
        listTab.listTab.grade === '3급' ||
        listTab.listTab.grade === '준3급'
      ) {
        setType('kbs');
        setState({
          req: state.req.concat([
            ...morenewBook?.filter(
              x => x.grade === '3급' || x.grade === '준3급',
            ),
          ]),
          page: state.page + 1,
        });
      } else if (
        listTab.listTab.grade === '4급' ||
        listTab.listTab.grade === '준4급'
      ) {
        setType('kbs');
        setState({
          req: state.req.concat([
            ...morenewBook?.filter(
              x => x.grade === '4급' || x.grade === '준4급',
            ),
          ]),
          page: state.page + 1,
        });
      } else if (
        listTab.listTab.grade === '5급' ||
        listTab.listTab.grade === '준5급'
      ) {
        setType('kbs');
        setState({
          req: state.req.concat([
            ...morenewBook?.filter(
              x => x.grade === '5급' || x.grade === '준5급',
            ),
          ]),
          page: state.page + 1,
        });
      } else if (listTab.listTab.grade === '누리급') {
        setType('kbs');
        setState({
          req: state.req.concat([
            ...morenewBook?.filter(x => x.grade === '누리급'),
          ]),
          page: state.page + 1,
        });
      }
      setLoading(false);
    }
    return () => {
      mount = false;
    };
  }, [morenewBook]);

  const loadMore = () => {
    if (!loading) {
      setLoading(true);
      fetchRequested(start);
      }
      return () => {};
  };

  const getDrawerList = async bookCd => {
    const {data, status} = await requestGet({
      url: consts.apiUrl + '/mypage/bookDrawer/keep',
      query: {
        bookIdx: bookCd,
      },
    });
    if (status === 'SUCCESS') {
      return data;
    } else {
      return 'bookDrawerKeepFailed';
    }
  };

  const renderFooter = () => {
    if (kbsBook?.length === 0 || !loading) {
      return <></>;
    } else {
      return (
        <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            top: -50,
          }}
          color={colors.blue}
        />
      );
    }
  };

  return (
    <View
      style={[
        styles.root,
        state.req.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {state.req.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            top: -50,
          }}
          color={colors.blue}
        />
        </View>
      ) : (
        <FlatList
          ref={scrollRef}
          data={state.req}
          onScroll={event => {
            setContentVerticalOffset(event.nativeEvent.contentOffset.y);
          }}
          extraData={state.req}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            item.type = type;
            return (
              <BookListItem
                item={item}
                type={booktype}
                index={index}
                grade={listTab.listTab.grade}
                th={th}
                gradeStyle={listTab.listTab.gradeStyle}
                getDrawerList={getDrawerList}
                max={
                  listTab.listTab.grade !== null
                    ? kbsBook.length
                    : newBook.length
                }
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={1}
          ListFooterComponent={renderFooter}
        />
      )}
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={styles.topButton}>
          <Image source={images.scrollTop} style={styles.scrolltotop} />
        </TouchableOpacity>
        )}

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  scrolltotop: {
    width: widthPercentage(35),
    height: heightPercentage(35),
    resizeMode: 'contain',
  },
  topButton: {
    alignItems: 'center',
    width: widthPercentage(35),
    height: heightPercentage(35),
    position: 'absolute',
    bottom: 0,
    left: screenWidth / 2.2,
    display: 'flex',
  },
});
