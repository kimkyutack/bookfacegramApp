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
  screenHeight,
  widthPercentage,
  heightPercentage,
} from '../../../services/util';
import {requestGet, requestPost} from '../../../services/network';
import {dialogError} from '../../../redux/dialog/DialogActions';
import TopMyBooksMain from '../home-main/TopNewBooksMain';

export default function TopMyBooksList({route, genre, rank, topic, startPage}) {
  const scrollRef = useRef();
  const scrollRef2 = useRef();
  const scrollRef3 = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [type, setType] = useState('new');
  const [start, setStart] = useState(startPage);
  const [morenewBook, setNewBook] = useState([]);
  const [state, setState] = useState({
    req: [],
    page: 1,
  });

  const fetchRequested = async stnum => {
    try {
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/mybooks',
        query: {
          startPaging: stnum,
          endPaging: startPage,
          type:listTab.listTab.selectType,
        },
      });
      if (status === 'SUCCESS') {
        setLoading(false);
        setStart(start + startPage);
        setNewBook([...data]);
      }
      return status;
    } catch (error) {
      setLoading(false);
      dispatch(dialogError(error));
    }
  };
  useEffect(() => {
    setLoading(true);
    setStart(startPage);
    setState({
          req: [],
          page: 1,
        });
    if(listTab.listTab.selectType === 'genre'){
      setNewBook(genre);
    }else if(listTab.listTab.selectType === 'rank'){
      setNewBook(rank);
    }else if(listTab.listTab.selectType === 'topic'){
      setNewBook(topic);
    }
    
    let mount = true;
    if (mount) {
      scrollRef.current?.scrollToOffset({y: 0.1, animated: false});
      scrollRef2.current?.scrollToOffset({y: 0.1, animated: false});
      scrollRef3.current?.scrollToOffset({y: 0.1, animated: false});
        setType('new');
        
        
    }
    
      setLoading(false);
    return () => {
      mount = false;
    };
  }, [listTab.listTab.selectType]);

  useEffect(() => {
    setLoading(true);
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
  }, [morenewBook,!listTab.listTab.selectType]);

  /*useEffect(() => {
    let mount = true;
    if(genre.length !== 0){
      setLoading(true);
      if (mount) {
      if(listTab.listTab.selectType === 'genre'){
        setState({req: genre, page: 1});
      }else if(listTab.listTab.selectType === 'rank'){
        setState({req: rank, page: 1});
      }else if(listTab.listTab.selectType === 'topic'){
        setState({req: topic, page: 1});
      }
      }
        
        setLoading(false);
    }
    return () => {
      mount = false;
    };
  }, [genre.length]);*/

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
        state.req.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {state.req.length === 0 && !loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>추천 도서리스트가 없습니다.</TextWrap>
        </View>
      ) : 
      state.req.length === 0 && loading ? (
        <ActivityIndicator
          size="large"
          style={{
            alignSelf: 'center',
            top: screenHeight / 3,
          }}
          color={colors.blue}
        />
      ) :  state.req.length !== 0 && listTab.listTab.selectType === 'genre' ? (
        <FlatList
          ref={scrollRef}
          data={state.req}
          extraData={state.req}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return (
              <MyBookListItem
                item={item}
                type={type}
                index={index}
                getDrawerList={getDrawerList}
                max={state.req.length}
                select={listTab.listTab.selectType}
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={1}
          ListFooterComponent={renderFooter}
        />
      ) :  state.req.length !== 0 && listTab.listTab.selectType === 'rank' ? (
        <FlatList
          ref={scrollRef2}
          data={state.req}
          extraData={state.req}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return (
              <MyBookListItem
                item={item}
                type={type}
                index={index}
                getDrawerList={getDrawerList}
                max={state.req.length}
                select={listTab.listTab.selectType}
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={1}
          ListFooterComponent={renderFooter}
        />
      )
    :  state.req.length !== 0 && listTab.listTab.selectType === 'topic' ? (
        <FlatList
          ref={scrollRef3}
          data={state.req}
          extraData={state.req}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return (
              <MyBookListItem
                item={item}
                type={type}
                index={index}
                getDrawerList={getDrawerList}
                max={state.req.length}
                select={listTab.listTab.selectType}
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={1}
          ListFooterComponent={renderFooter}
        />
      ) : <></>
    }
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
