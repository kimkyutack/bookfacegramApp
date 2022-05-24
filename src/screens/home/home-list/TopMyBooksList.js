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
import MyBookListItem from './MyBookListitem';
import TopMyBooks from '../TopNewBooks';
import {
  screenWidth,
  widthPercentage,
  heightPercentage,
} from '../../../services/util';
import {requestGet, requestPost} from '../../../services/network';
import {dialogError} from '../../../redux/dialog/DialogActions';
import TopMyBooksMain from '../home-main/TopNewBooksMain';

export default function TopMyBooksList({route, genre, rank, topic}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [type, setType] = useState('new');
  const [selectType, setselectType] = useState('genre');
  const [start, setStart] = useState(30);
  const [morenewBook, setNewBook] = useState([]);
  const [state, setState] = useState({
    req: genre,
    page: 1,
  });
  const fetchRequested = async startpage => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/mybooks',
        query: {
          startPaging: startpage,
          endPaging: 30,
          type:selectType,
        },
      });

      if (status === 'SUCCESS') {
        setStart(start + 30);
        setNewBook([...data]);
      }
      return status;
    } catch (error) {
      setLoading(false);
      dispatch(dialogError(error));
    }
  };
  useEffect(() => {
    setselectType(listTab.listTab.selectType);
    setNewBook(genre);
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
        setType('new');
        setState({req: morenewBook, page: 1});
    }
    return () => {
      mount = false;
    };
  }, [listTab.listTab.selectType]);

  useEffect(() => {
    let mount = true;
    if (mount) {
        setType('new');
        setState({
          req: state.req.concat([...morenewBook]),
          page: state.page + 1,
        });
      }
      setLoading(false);
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
    if (morenewBook?.length === 0 || !loading) {
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
        morenewBook.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {morenewBook.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>추천 도서리스트가 없습니다.</TextWrap>
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
              <MyBookListItem
                item={item}
                type={type}
                index={index}
                getDrawerList={getDrawerList}
                max={morenewBook.length}
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={1}
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
