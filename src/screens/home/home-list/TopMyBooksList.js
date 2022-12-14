import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
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
import { requestGet, requestPost } from '../../../services/network';
import { dialogError } from '../../../redux/dialog/DialogActions';
import TopMyBooksMain from '../home-main/TopNewBooksMain';
import { navigate } from '../../../services/navigation';
import { useIsFocused } from '@react-navigation/native';
import { browsingTime } from '../../../redux/session/SessionAction';

export default function TopMyBooksList({ route, genre, rank, topic, startPage }) {
  const scrollRef = useRef();
  const scrollRef2 = useRef();
  const scrollRef3 = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [type, setType] = useState('new');
  const [start, setStart] = useState(startPage);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const [morenewBook, setNewBook] = useState([]);
  const [sessionTime, setSessionTime] = useState('000000');
  const isFocused = useIsFocused();
  const [state, setState] = useState({
    req: [],
    page: 1,
  });
  const user = useSelector(s => s.user, shallowEqual);


  const fetchRequested = async stnum => {
    try {
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/mybooks',
        query: {
          startPaging: stnum,
          endPaging: startPage,
          type: listTab.listTab.selectType,
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

  let hour = 0, minute = 0, second = -1;

  function timeCount() {


    let dsp_hour, dsp_minute, dsp_second;

    second++;

    if (minute == 60) {
      hour++;
      minute = 0;
    }
    if (second == 60) {
      minute++;
      second = 0;
    }

    if (hour < 10)
      dsp_hour = '0' + hour;
    else
      dsp_hour = hour;

    if (minute < 10)
      dsp_minute = '0' + minute;
    else
      dsp_minute = minute;

    if (second < 10)
      dsp_second = '0' + second;
    else
      dsp_second = second;


    let date_state = dsp_hour + dsp_minute + dsp_second;


    setSessionTime(date_state);
  };

  //page ?????? ?????? ??????
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {
        if (listTab.listTab.selectType === 'genre') {
          dispatch(browsingTime('MYBOOKS>?????????>????????????', sessionTime, user.member_id));
        } else if (listTab.listTab.selectType === 'rank') {
          dispatch(browsingTime('MYBOOKS>?????????>????????????', sessionTime, user.member_id));
        } else {
          dispatch(browsingTime('MYBOOKS>?????????>????????????', sessionTime, user.member_id));
        }

      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);



  useEffect(() => {
    let mount = true;
    if (genre.length !== 0) {
      setLoading(true);
      if (mount) {
        if (listTab.listTab.selectType === 'genre') {
          setState({ req: genre, page: 0 });
        } else if (listTab.listTab.selectType === 'rank') {
          setState({ req: rank, page: 0 });
        } else if (listTab.listTab.selectType === 'topic') {
          setState({ req: topic, page: 0 });
        }
        setLoading(false);
      }
    }
    return () => {
      mount = false;
    };
  }, [genre.length]);

  useEffect(() => {
    setLoading(true);
    setStart(startPage);
    setState({
      req: [],
      page: 1,
    });
    if (listTab.listTab.selectType === 'genre') {
      setNewBook(genre);
    } else if (listTab.listTab.selectType === 'rank') {
      setNewBook(rank);
    } else if (listTab.listTab.selectType === 'topic') {
      setNewBook(topic);
    }

    let mount = true;
    if (mount) {
      setLoading(false);
      scrollRef.current?.scrollToOffset({ y: 0.1, animated: false });
      scrollRef2.current?.scrollToOffset({ y: 0.1, animated: false });
      scrollRef3.current?.scrollToOffset({ y: 0.1, animated: false });
      setType('new');


    }


    return () => {
      mount = false;
    };
  }, [listTab.listTab.selectType, topic]);

  useEffect(() => {
    setLoading(true);
    let mount = true;
    if (mount) {
      if (state.page !== 0) {
        setType('new');
        setState({
          req: state.req.concat([...morenewBook]),
          page: state.page,
        });
      }
      setLoading(false);
    }


    return () => {
      mount = false;
    };
  }, [morenewBook, !listTab.listTab.selectType]);

  const loadMore = () => {
    if (!loading) {
      setState({
        req: state.req,
        page: state.page + 1,
      });
      setLoading(true);
      fetchRequested(start);
    }
    return () => { };
  };

  const getDrawerList = async bookCd => {
    const { data, status } = await requestGet({
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
        state.req.length === 0 && { flex: 1, justifyContent: 'center' },
      ]}>
      {
        state.req.length === 0 && loading ? (
          <ActivityIndicator
            size="large"
            style={{
              alignSelf: 'center',
              top: screenHeight / 3,
            }}
            color={colors.blue}
          />
        ) : state.req.length !== 0 && listTab.listTab.selectType === 'genre' ? (
          <FlatList
            ref={scrollRef}
            data={state.req}
            extraData={state.req}
            onScroll={event => {
              setContentVerticalOffset(event.nativeEvent.contentOffset.y);
            }}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item, index }) => {
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
        ) : state.req.length !== 0 && listTab.listTab.selectType === 'rank' ? (
          <FlatList
            ref={scrollRef2}
            data={state.req}
            extraData={state.req}
            onScroll={event => {
              setContentVerticalOffset(event.nativeEvent.contentOffset.y);
            }}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item, index }) => {
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
          : state.req.length !== 0 && listTab.listTab.selectType === 'topic' ? (
            <FlatList
              ref={scrollRef3}
              data={state.req}
              extraData={state.req}
              onScroll={event => {
                setContentVerticalOffset(event.nativeEvent.contentOffset.y);
              }}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={({ item, index }) => {
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
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          onPress={() => {
            listTab.listTab.selectType === 'genre' ?
              scrollRef.current.scrollToOffset({ animated: true, offset: 0 })
              : listTab.listTab.selectType === 'rank' ?
                scrollRef2.current.scrollToOffset({ animated: true, offset: 0 })
                : scrollRef3.current.scrollToOffset({ animated: true, offset: 0 });
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
