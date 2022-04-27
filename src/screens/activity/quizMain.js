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
} from '../../redux/dialog/DialogActions';
import {relativeTimeRounding} from 'moment-timezone';

export default function QuizMain({route, kbsBook, notKbsBook, navigation}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [render, setRender] = useState([]);
  const [type, setType] = useState('kbs');
  const [start, setStart] = useState(20);
  const [grade, setGrade] = useState('전체');
  const [morenotBook, setNotBook] = useState([]);
  const [morekbsBook, setKbsBook] = useState(kbsBook);
  const [state, setState] = useState({req: kbsBook, page: 1});

  const fetchRequested = async start => {
    try {
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/quiz/activity',
        query: {
          rank: 'all',
          startPaging: start,
          endPaging: 20,
        },
      });
      if (status === 'SUCCESS') {
        setState({
          req: state.req.concat([...data.kbsBookQuizs]), // 기존 data에 추가.
          page: state.page + 1,
        });
        //setNotBook([...data.notKbsBookQuizs]);
        //setKbsBook([...data.kbsBookQuizs]);
      }
      return status;
    } catch (error) {
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

  const loadMore = () => {
    setStart(start + 20);
    fetchRequested(start + 20);
    let mount = true;

    return () => {};
  };

  return (
    <View
      style={[
        styles.root,
        kbsBook.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      <View style={styles.row}>
        <TouchableOpacity
          style={{
            marginLeft: widthPercentage(20),
            width: widthPercentage(160),
            height: heightPercentage(30),
            top: heightPercentage(15),
            borderWidth: 0.5,
            borderStyle: 'solid',
            borderColor: '#c9c9c9',
            position: 'relative',
            zIndex: 1, // works on ios
            elevation: 1,
          }}>
          <View>
            <TextWrap style={styles.selectfont}>{'학년별'}</TextWrap>
            <Image source={images.selectbox} style={styles.select} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: widthPercentage(160),
            height: heightPercentage(30),
            top: heightPercentage(15),
            borderWidth: 0.5,
            borderStyle: 'solid',
            borderColor: '#c9c9c9',
            zIndex: 1, // works on ios
            elevation: 1,
          }}>
          <View>
            <TextWrap style={styles.selectfont}>{grade}</TextWrap>
            <Image source={images.selectbox} style={styles.select} />
          </View>
        </TouchableOpacity>
      </View>
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
          onEndReachedThreshold={0}
          numColumns={2}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginRight: screenWidth / 20,
    flex: 1,
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
