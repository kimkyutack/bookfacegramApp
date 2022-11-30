import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import MainQuiz from '../activity/MainQuiz';
import Kbstest from '../activity/kbstest';
import Examtest from '../activity/examtest';
import Examright from '../activity/examright';
import Examwrong from '../activity/examwrong';
import Bookcontest from '../activity/bookcontest';
import ActivityMain from '../activity/ActivityMain';
import AudioBook from '../activity/audiobook';
import {
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import Gatherlist from '../activity/Gatherlist';
import GatherAll from '../activity/GatherAll';
import GatheringDetail from '../activity/GatherDetail';
import ApplyInfo from '../activity/ApplyInfo';

export default function TopActivity({route}) {

  return (
    <View style={styles.root}>
      {route.params.type === 'quiz' ? (
        <MainQuiz route={route} start={0} />
      ) : route.params.type === 'kbstest' ? (
        <Kbstest route={route} />
      ) : route.params.type === 'examtest' ? (
        <Examtest route={route} />
      ) : route.params.type === 'contest' ? (
        <Bookcontest route={route} />
      ) : route.params.type === 'examright' ? (
        <Examright route={route} />
      ) : route.params.type === 'examwrong' ? (
        <Examwrong route={route} />
      ) : route.params.type === 'audio' ? (
        <AudioBook route={route}  start={0}/>
      ) : route.params.type === 'gather' ? (
        <Gatherlist route={route}/>
      ) : route.params.type === 'gatherlist' ? (
        <GatherAll route={route}/>
      ) : route.params.type === 'info' ? (
        <ApplyInfo route={route}/>
      ) : route.params.type === 'detail' ? (
        <GatheringDetail route={route}/>
      ) : (
        <ActivityMain route={route} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  root2: {
    width: '90%',
    top: heightPercentage(10),
    flexDirection: 'row',
  },
  font: {
    left: widthPercentage(20),
    top: heightPercentage(10),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font2: {
    left: widthPercentage(16),
    top: heightPercentage(100),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font3: {
    left: widthPercentage(24),
    top: heightPercentage(100),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font4: {
    left: '14%',
    top: heightPercentage(100),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font5: {
    right: widthPercentage(58),
    top: heightPercentage(90),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  font6: {
    left: widthPercentage(18),
    top: heightPercentage(90),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  img1: {
    resizeMode: 'contain',
    width: widthPercentage(35),
    height: heightPercentage(45),
    left: widthPercentage(62),
    top: heightPercentage(30),
  },
  img2: {
    resizeMode: 'contain',
    width: widthPercentage(35),
    height: heightPercentage(45),
    left: widthPercentage(66),
    top: heightPercentage(30),
  },
  box2: {
    margin: 5,
    borderColor: '#c9c9c9',
    borderWidth: 0.5,
    borderRadius: 20,
    width: widthPercentage(40),
    height: heightPercentage(160),
    flex: 1,
    flexDirection: 'row',
    left: widthPercentage(20),
    top: heightPercentage(25),
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
  box3: {
    margin: 5,
    width: widthPercentage(40),
    height: heightPercentage(160),
    flex: 1,
    flexDirection: 'row',
    left: 0,
    top: 0,
    fontSize: fontPercentage(13),
    fontWeight: 'bold',
  },
});
