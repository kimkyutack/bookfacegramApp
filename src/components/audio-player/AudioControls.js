import React, { component, useEffect , useState} from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
  } from 'react-native';
import images from '../../libs/images';
import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
} from '../../services/util';
import TextWrap from '../text-wrap/TextWrap';
import SeekBar from './SeekBar';
import TrackPlayer, { usePlaybackState,State } from 'react-native-track-player';
import trackPlayerServices from './services/PlaybackService';
import { useOnTogglePlayback } from './hooks/useOnTogglePlayback';
import { useGettingPos } from './hooks/useProgressState';

 //오디오 모달(슬라이더 포함)
  const AudioControls = ({
    //현재 오디오 재생 시점, 오디오 정보를 받음
    currentTime,
    track,
    backRate,
  }) => {
    //오디오 현재 진행 상태 (슬라이더 관련)
    const pos = useGettingPos();

    //오디오 상태(멈춰있는지 재생중인지..)
    const state = usePlaybackState(); 
    const isPlaying = state === State.Playing;  

    //Play, Pause 토글 이벤트
    const onTogglePlayback = useOnTogglePlayback();

    //배속 세팅
    const [curRate, setCurRate] = useState(1.0);
    const [slider, setSlider] = useState(false);

    const onHandleRate = async () => {
      try{
        await TrackPlayer.setRate(curRate + 0.5); //일단 배속 +0.5
        let rate = await TrackPlayer.getRate(); //현재 배속 저장
        if (rate > backRate){  //설정 이상일 경우 1로 세팅
          await TrackPlayer.setRate(1.0);
          rate = 1;
        }
        setCurRate(rate); //화면에 표시해 줄 변수 배속 저장
      }catch(error){}
    }

    useEffect(() => {

      (async () => {
        //오디오 셋업
        try{
          //처음에만 셋업 진행
          const isSetup = await TrackPlayer.isServiceRunning();
          
          if (!isSetup) {
            await TrackPlayer.setupPlayer().then(async () =>{
              TrackPlayer.registerPlaybackService(()=> trackPlayerServices);
            });
          }
          
        }catch(error){
          console.log(error);
        }

        try{
          const trackCount = (await TrackPlayer.getQueue()).length; //어플 키고 처음인지 확인

          //오디오 재생 목록에 몇개 있는지 체크(큐 리셋이 안됨...)
          if (trackCount < 1){  //처음일 경우 그냥 큐에 저장
            TrackPlayer.add(track);
            TrackPlayer.removeUpcomingTracks();
          }else{
            TrackPlayer.add(track,1); //처음이 아닐경우 큐의 맨 앞에 저장
            TrackPlayer.removeUpcomingTracks();
          }
          
          TrackPlayer.setRate(1);   
          if (backRate == undefined) {
            backRate = 2
          }

          // currentTime 부터 재생
          TrackPlayer.seekTo(currentTime);
          TrackPlayer.play(); 
          setSlider(true);
        }catch(error){
          console.log(error);
        }
      })();
    }, []);

    return (
      <View style={styles.root}>
        {/* 오디오 컨트롤 */}
        <View style={styles.audioContainer}>
          {/* 슬라이더 */}
          {slider && <SeekBar />}
          {/* 오디오 컨트롤 패널 */}
          <View style={styles.container}>
            {/* 배속 기능 */}
            <TouchableOpacity activeOpacity={0.0} onPress={onHandleRate} style={styles.BackRate}>
              <TextWrap style={styles.BackRate_Number}>
                  {parseFloat(curRate).toFixed(1)}  
              </TextWrap>
              <TextWrap style={styles.BackRate_String}>
                  배속
              </TextWrap>
            </TouchableOpacity>

            {/* White Space */}
            <View style={{width: 40}} />

            {/* 15초 이전 */}
            <TouchableOpacity onPress={() => TrackPlayer.seekTo(pos - 15)} >
              <Image source={images.audio_minus15} style={styles.skipButton}/>
            </TouchableOpacity>

            {/* White Space */} 
            <View style={{width: 40}} />

            {/* PLAY 버튼 */}
            {!isPlaying ?
            <TouchableOpacity onPress={onTogglePlayback}>
              <View style={styles.playButton}>
                <Image source={images.play_btn} style={styles.playButton_image}/>
              </View>
            </TouchableOpacity> :
            <TouchableOpacity onPress={onTogglePlayback}>
              <View style={styles.playButton}>
                <Image source={images.pause_btn} style={styles.playButton_image}/>
              </View>
            </TouchableOpacity>
            }

            {/* White Space */}
            <View style={{width: 40}} />

            {/* 15초 빨리감기 */}
            <TouchableOpacity onPress={() => TrackPlayer.seekTo(pos +  15)}>
              <Image style={styles.skipButton} source={images.audio_plus15}/>
            </TouchableOpacity>

            {/* White Space */}
            <View style={{width: 40}} />
          </View>
        </View>
      </View>
    );
  };
  
  export default AudioControls;
  
  const styles = StyleSheet.create({
    audioContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 10,
      marginTop: 10,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 33,
      paddingTop: 0,
      height: 85,
    },
    BackRate: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    BackRate_Number: {
        color: '#f9f9f9',
        fontSize: fontPercentage(16),
        fontWeight: 'bold',
    },
    BackRate_String: {
        color: '#f9f9f9',
        fontSize: fontPercentage(12),
    },
    skipButton: {
        height: 42,
        width: 42,
    },
    playButton_image: {
      height: 90,
      width: 90,
    },
    playButton: {
      height: 62,
      width: 62,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })