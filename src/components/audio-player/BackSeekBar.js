import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import { useSettingPos } from './hooks/useProgressState';
import images from '../../libs/images';
import { heightPercentage, screenWidth, widthPercentage } from '../../services/util';

const BackSeekBar = ({
}) => {
  const progress = useProgress(500); //오디오 진행 현황(duration, position) 0.5초마다 업데이트 ...호출이 너무 잦으면 callback 501 발생하여 수정
  useSettingPos(progress.position);
  //console.log(progress)

    
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
        thumbImage={images.circle24}
        step={0}  //1씩 증가
        />
    </View>
  );
};

export default BackSeekBar;

const styles = StyleSheet.create({
  slider: {
    marginTop: -widthPercentage(28),
    marginLeft: -widthPercentage(24),
    marginBottom: heightPercentage(5),
    width: screenWidth*1.124,
    scaleY: heightPercentage(3),
    scaleX: widthPercentage(2),
  },
  container: {
    paddingTop: 16,
    marginLeft: 10,
    marginRight: 10,
    width: screenWidth,
    height: '20%',
  },
});