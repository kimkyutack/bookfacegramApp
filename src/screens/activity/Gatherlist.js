import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { requestGet } from '../../services/network';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import {
  screenWidth,
  screenHeight,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import { dialogError } from '../../redux/dialog/DialogActions';
import { useIsFocused } from '@react-navigation/native';
import { browsingTime } from '../../redux/session/SessionAction';
import GatherMain from './GatherMain';

export default function Gatherlist({ route }) {
  const dispatch = useDispatch();
  const detailTab = useSelector(s => s.tab, shallowEqual);
  const [loading, setLoading] = useState(true);
  const [endGather, setEndGather] = useState([]);
  const [ingGather, setIngGather] = useState([]);
  const [Rank, setRank] = useState(detailTab.rank);
  const [sessionTime, setSessionTime] = useState('000000');
  const isFocused = useIsFocused();
  const user = useSelector(s => s.user, shallowEqual);

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

  //page 로그 찍는 로직
  useEffect(() => {
    if (isFocused) {
      var timer = setInterval(() => { timeCount() }, 1000);
    }

    if (!isFocused) {
      if (sessionTime !== '000000') {

        dispatch(browsingTime('독서모임(메인페이지)', sessionTime, user.member_id));
      }
    }
    return () => {
      clearInterval(timer);
      setSessionTime('000000');
    }
  }, [isFocused]);

  useEffect(() => {
    setRank(detailTab.rank);
  }, [detailTab.rank]);
  //마감임박 독서모임 api
  const fetchRequested = async () => {
    try {
      setLoading(true);
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/book/quiz/activity',
        query: {
          rank: Rank,
          startPaging: 0,
          endPaging: 3,
        },
      });
      if (status === 'SUCCESS') {
        setEndGather([...data.kbsBookQuizs]);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };
  //모집중인 독서모임 api
  const fetchRequested2 = async () => {
    try {
      setLoading(true);
      const { data, status } = await requestGet({
        url: consts.apiUrl + '/book/quiz/activity',
        query: {
          rank: Rank,
          startPaging: 0,
          endPaging: 20,
        },
      });
      if (status === 'SUCCESS') {
        setIngGather([...data.kbsBookQuizs]);
      }
      return status;
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    fetchRequested().then(response => {
      fetchRequested2().then(res => {
      if (res === 'SUCCESS') {
        setLoading(false);
      } else {
        dispatch(dialogError(res || 'fail'));
      }
      })
    });

    return () => {
      setLoading(true);
      setEndGather([]);
      setIngGather([]);
    };
  }, [Rank]);

  return (
    <View style={styles.root}>
      {loading ? (
        <View style={[styles.loading]}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : !loading ? (
          <GatherMain
            rank={Rank}
            endGather={endGather}
            ingGather={ingGather}
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
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  loading: {
    //flex: 1,
    justifyContent: 'center',
    width: screenWidth,
    height: screenHeight,
    alignItems: 'center',
    bottom: screenHeight / 5,
    backgroundColor: colors.white,
  },
});
