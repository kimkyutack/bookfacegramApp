import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {requestGet} from '../../services/network';
import consts from '../../libs/consts';
import images from '../../libs/images';
import colors from '../../libs/colors';
import QuizMain from '../activity/quizMain';
import TextWrap from '../../components/text-wrap/TextWrap';
import {
  screenWidth,
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import {dialogError} from '../../redux/dialog/DialogActions';
import {dialogOpenGrade} from '../../redux/dialog/DialogActions';

export default function MainQuiz({route}, start) {
  const dispatch = useDispatch();
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const [loading, setLoading] = useState(true);
  const [notKbsQuiz, setnotKbsQuiz] = useState([]);
  const [KbsQuiz, setKbsQuiz] = useState([]);
  const [Rank, setRank] = useState(detailTab.rank);
  const [grade, setGrade] = useState('전체');
  //console.log(detailTab);
  useEffect(() => {
    setRank(detailTab.rank);
  }, [detailTab.rank]);

  const fetchRequested = async () => {
    try {
      if (JSON.stringify(start) === '{}') {
        start = 0;
      }
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/quiz/activity',
        query: {
          rank: Rank,
          startPaging: start,
          endPaging: 20,
        },
      });
      if (status === 'SUCCESS') {
        switch (Rank) {
          case 'all':
            setGrade('전체');
            break;
          case 'preSchool':
            setGrade('유아');
            break;
          case '00004':
            setGrade('초등학교 1학년');
            break;
          case '00005':
            setGrade('초등학교 2학년');
            break;
          case '00006':
            setGrade('초등학교 3학년');
            break;
          case '00007':
            setGrade('초등학교 4학년');
            break;
          case '00008':
            setGrade('초등학교 5학년');
            break;
          case '00009':
            setGrade('초등학교 6학년');
            break;
          case '00010':
            setGrade('중학교 1학년');
            break;
          case '00011':
            setGrade('중학교 2학년');
            break;
          case '00012':
            setGrade('중학교 3학년');
            break;
          case '00013':
            setGrade('고등학교 1학년');
            break;
          case '00014':
            setGrade('고등학교 2학년');
            break;
          case '00015':
            setGrade('고등학교 3학년');
            break;
          default:
            setGrade('전체');
            break;
        }
        setKbsQuiz([...data.kbsBookQuizs]);
        setnotKbsQuiz([...data.notKbsBookQuizs]);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    fetchRequested().then(res => {
      if (res === 'SUCCESS') {
        setLoading(false);
      } else {
        dispatch(dialogError(res || 'fail'));
      }
    });

    return () => {
      setLoading(true);
      setKbsQuiz([]);
      setnotKbsQuiz([]);
    };
  }, [Rank]);

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: heightPercentage(29),
            top: heightPercentage(15),
            borderWidth: 0.3,
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
            flex: 1,
            height: heightPercentage(29),
            top: heightPercentage(15),
            borderWidth: 0.3,
            borderStyle: 'solid',
            borderColor: '#c9c9c9',
            position: 'relative',
            zIndex: 1, // works on ios
            elevation: 1,
          }}
          onPress={() => {
            dispatch(dialogOpenGrade({message: '준비중.', grade: Rank}));
          }}>
          <View>
            <TextWrap style={styles.selectfont}>{grade}</TextWrap>
            <Image source={images.selectbox} style={styles.select} />
          </View>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={[styles.root]}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : !loading ? (
        <QuizMain
          route={route}
          rank={Rank}
          kbsBook={KbsQuiz}
          notKbsBook={notKbsQuiz}
        />
      ) : (
        <></>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    //flex: 1,
    width: screenWidth,
    height: screenHeight / 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  row: {
    top: 10,
    width: screenWidth * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight / 15,
    flexDirection: 'row',
  },
  cameraIcon: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'cover',
  },
  select: {
    position: 'absolute',
    width: '100%',
    height: heightPercentage(28),
  },
  selectfont: {
    fontSize: fontPercentage(9),
    marginLeft: widthPercentage(5),
    top: heightPercentage(8),
    zIndex: 10, // works on ios
    elevation: 10,
  },
});
