import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import { useSettingPos } from './hooks/useProgressState';

const SeekBar = ({
}) => {
  const progress = useProgress(150); //오디오 진행 현황(duration, position)... 0.1초마다 업데이트
  useSettingPos(progress.position);
  // console.log(useGettingPos());
  return (
    <View style={styles.container}>
      <Slider
        maximumValue={progress.duration}  //슬라이더 Max값 설정
        onSlidingComplete={value => {TrackPlayer.seekTo(value);}} //사용자가 슬라이더를 만질 때 동기화
        value={progress.position} //슬라이더 현재값 오디오 진행 시점으로 동기화
        style={styles.slider}
        minimumTrackTintColor='#30acd9' //진행된 슬라이더 색 진하게 표시
        maximumTrackTintColor='#3f748a' //진행될 슬라이더 색 연하게 표시
        thumbTintColor='#f9f9f9'  //현재 위치 표시
        thumbStyle={styles.thumb}
        trackStyle={styles.track}
        step={0}  //1씩 증가
        />
      
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.text}>
          {/* 오디오 현재 값 */}
          {new Date(progress.position * 1000).toISOString().slice(14, 19)}
        </Text>
        <View style={{flex: 1}} />
        <Text style={[styles.text, {width: 40}]}>
          {/* 오디오 MAX 값 */}
          {new Date(progress.duration * 1000).toISOString().slice(14, 19)}
        </Text>
      </View>
    </View>
  );
};

export default SeekBar;

const styles = StyleSheet.create({
  slider: {
    marginTop: -5,
    marginLeft: -20,
    marginBottom: 5,
    width: '109%',
    scaleY: 1.2,
    scaleX: 1.2,
  },
  container: {
    paddingTop: 16,
    marginLeft: 10,
    marginRight: 10,
    width: '90%',
    height: '20%',
  },
  track: {
    borderRadius: 10,
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    textAlign:'center',
  }
});