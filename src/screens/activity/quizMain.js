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
import TextWrap from '../../components/text-wrap/TextWrap';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import images from '../../libs/images';
import routes from '../../libs/routes';
import QuizBookitem from '../activity/QuizBookitem';
import MainQuiz from '../activity/MainQuiz';
import {
  screenWidth,
  widthPercentage,
  heightPercentage,
} from '../../services/util';
import {requestGet, requestPost} from '../../services/network';
import {dialogError} from '../../redux/dialog/DialogActions';

export default function QuizMain({route, kbsBook, notKbsBook}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const listTab = useSelector(s => s.tab, shallowEqual);
  const [render, setRender] = useState([]);
  const [type, setType] = useState('kbs');
  const [start, setStart] = useState(20);
  const [morenotBook, setNotBook] = useState([]);
  const [morekbsBook, setKbsBook] = useState([]);

  const fetchRequested = async () => {
    try {
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/quiz/activity',
        query: {
          rank: 'all',
          startPaging: 0,
          endPaging: 20,
        },
      });
      if (status === 'SUCCESS') {
        setNotBook([...data.notKbsBookQuizs]);
        setKbsBook([...data.kbsBookQuizs]);
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
    fetchRequested();
    let mount = true;

    return () => {
      mount = false;
    };
  };

  return (
    <View
      style={[
        styles.root,
        morekbsBook.length === 0 && {flex: 1, justifyContent: 'center'},
      ]}>
      {morekbsBook.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextWrap>QuizList가 없습니다.</TextWrap>
        </View>
      ) : (
        <FlatList
          ref={scrollRef}
          data={morekbsBook}
          extraData={morekbsBook}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <QuizBookitem item={item} type={type} index={index} />;
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0}
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
