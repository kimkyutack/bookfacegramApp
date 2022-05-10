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

export default function TopNewBooksList({route, newBook, kbsBook, th}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [rednerData, setRenderData] = useState([]);
  const [type, setType] = useState('new');
  const [start, setStart] = useState(30);
  const [morenewBook, setNewBook] = useState([]);
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
      setLoading(false);
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
        setState({req: morenewBook, page: 1});
      } else if (listTab.listTab.grade === '1급') {
        setType('kbs');
        setState({
          req: morenewBook?.filter(
            x => x.grade === '1급' || x.grade === '준1급',
          ),
          page: 1,
        });
      } else if (listTab.listTab.grade === '2급') {
        setType('kbs');
        setState({
          req: morenewBook?.filter(
            x => x.grade === '2급' || x.grade === '준2급',
          ),
          page: 1,
        });
      } else if (
        listTab.listTab.grade === '3급' ||
        listTab.listTab.grade === '준3급'
      ) {
        setType('kbs');
        setState({
          req: morenewBook?.filter(
            x => x.grade === '3급' || x.grade === '준3급',
          ),
          page: 1,
        });
      } else if (
        listTab.listTab.grade === '4급' ||
        listTab.listTab.grade === '준4급'
      ) {
        setType('kbs');
        setState({
          req: morenewBook?.filter(
            x => x.grade === '4급' || x.grade === '준4급',
          ),
          page: 1,
        });
      } else if (
        listTab.listTab.grade === '5급' ||
        listTab.listTab.grade === '준5급'
      ) {
        setType('kbs');
        setState({
          req: morenewBook?.filter(
            x => x.grade === '5급' || x.grade === '준5급',
          ),
          page: 1,
        });
      } else if (listTab.listTab.grade === '누리급') {
        setType('kbs');
        setState({
          req: morenewBook?.filter(x => x.grade === '누리급'),
          page: 1,
        });
      }
    }
    return () => {
      mount = false;
    };
  }, []);

  useEffect(() => {
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
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
    }
    return () => {
      mount = false;
    };
  }, [morenewBook]);

  const loadMore = () => {
    fetchRequested(start);

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
        state.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {state.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>BookList가 없습니다.</TextWrap>
        </View>
      ) : (
        <FlatList
          ref={scrollRef}
          data={state.req}
          extraData={state.req}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            item.type = type;
            return (
              <BookListItem
                item={item}
                type={type}
                index={index}
                grade={listTab.listTab.grade}
                th={th}
                gradeStyle={listTab.listTab.gradeStyle}
                getDrawerList={getDrawerList}
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={renderFooter}
        />
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
});
