import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {requestGet, requestPost} from '../../services/network';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import QuizMain from '../activity/quizMain';
import {dialogError} from '../../redux/dialog/DialogActions';

export default function MainQuiz({route}, start) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [notKbsQuiz, setnotKbsQuiz] = useState([]);
  const [KbsQuiz, setKbsQuiz] = useState([]);

  if (JSON.stringify(start) === '{}') {
    start = 0;
  }

  const fetchRequested = async () => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/book/quiz/activity',
        query: {
          rank: 'all',
          startPaging: start,
          endPaging: 20,
        },
      });
      if (status === 'SUCCESS') {
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
  }, []);

  return (
    <View style={styles.root}>
      {loading ? (
        <></>
      ) : !loading ? (
        <QuizMain route={route} kbsBook={KbsQuiz} notKbsBook={notKbsQuiz} />
      ) : (
        <></>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
