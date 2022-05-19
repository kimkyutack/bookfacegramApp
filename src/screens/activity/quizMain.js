import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import routes from '../../libs/routes';
import Topbar from '../../components/topbar/Topbar';
import SearchBar from '../../components/search-bar/SearchBar';
import TopTabs from '../activity/TopTabs';
import QuizBookitem from '../activity/QuizBookitem';
import Footer from '../../libs/footer';
import TextButton from '../../components/text-button/TextButton';
import {navigate} from '../../services/navigation';
import MainQuiz from '../activity/MainQuiz';
import {
  screenWidth,
  screenHeight,
  widthPercentage,
  heightPercentage,
  cameraItem,
} from '../../services/util';
import {requestGet, requestPost} from '../../services/network';
import {dialogError} from '../../redux/dialog/DialogActions';
import {
  dialogOpenSelect,
  dialogOpenMessage,
  dialogOpenGrade,
} from '../../redux/dialog/DialogActions';
import {relativeTimeRounding} from 'moment-timezone';
import {useHandler} from 'react-native-reanimated';

export default function QuizMain({
  route,
  rank,
  kbsBook,
  notKbsBook,
  navigation,
}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [render, setRender] = useState([]);
  const [type, setType] = useState('kbs');
  const [start, setStart] = useState(20);
  const [grade, setGrade] = useState('전체');
  const [morenotBook, setNotBook] = useState([]);
  const [morekbsBook, setKbsBook] = useState(kbsBook);
  const [state, setState] = useState({req: kbsBook, page: 1});

  const fetchRequested = async startpage => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/quiz/activity',
        query: {
          rank: rank,
          startPaging: startpage,
          endPaging: 20,
        },
      });
      setLoading(false);
      if (status === 'SUCCESS') {
        setStart(start + 20);
        setState({
          req: state.req.concat([...data.kbsBookQuizs]), // 기존 data에 추가.
          page: state.page + 1,
        });
        //setNotBook([...data.notKbsBookQuizs]);
        //setKbsBook([...data.kbsBookQuizs]);
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
    }
    return () => {
      mount = false;
    };
  }, []);

  const renderFooter = () => {
    if (kbsBook?.length === 0 || !loading || kbsBook?.length < 20) {
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

  const loadMore = () => {
    if(kbsBook.length >= 20){
      fetchRequested(start);
    }
    return () => {};
  };

  return (
    <View
      style={[
        styles.root,
        kbsBook.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {kbsBook.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>QuizList가 없습니다.</TextWrap>
        </View>
      ) : (
        <FlatList
          ref={scrollRef}
          data={state.req} //morekbsbook
          extraData={state.req} //morekbsbook
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <QuizBookitem item={item} type={type} index={index} />;
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.8}
          numColumns={2}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: screenWidth,
    flexDirection: 'column',
  },
  row: {
    height: screenHeight / 25,
    flexDirection: 'row',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  select: {
    position: 'absolute',
    width: widthPercentage(160),
    height: heightPercentage(28),
    zIndex: 3, // works on ios
    elevation: 3, // works on android
  },
  selectfont: {
    marginLeft: widthPercentage(5),
    top: heightPercentage(8),
    zIndex: 10, // works on ios
    elevation: 10,
  },
});
