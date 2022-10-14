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
  screenHeight,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import TextWrap from '../text-wrap/TextWrap';
import BackSeekBar from './BackSeekBar';
import TrackPlayer, { usePlaybackState,State } from 'react-native-track-player';
import trackPlayerServices from './services/PlaybackService';
import { useOnTogglePlayback } from './hooks/useOnTogglePlayback';
import { useGettingPos } from './hooks/useProgressState';
import { Text } from 'react-native';

export const onRegisterPlayback = async() => {
    
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

 TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());

 TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy())
}

 //오디오 모달(슬라이더 포함)
  const BackgroundControls = ({
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

    useEffect(() => {
      (async () => {
        //오디오 셋업
        try{
          //처음에만 셋업 진행
          const isSetup = await TrackPlayer.isServiceRunning();
          
          if (!isSetup) {
            TrackPlayer.registerPlaybackService(()=> onRegisterPlayback); //No Task Register~ 에러 발생하여 setup 전 등록
            await TrackPlayer.setupPlayer().then(() =>{
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
          {slider && <BackSeekBar />}
          {/* 오디오 컨트롤 패널 */}
          <View style={styles.container}>
            {/* White Space */}
            <View style={{flex:6, flexDirection:'row', marginBottom:heightPercentage(20), marginLeft:20}}>
              <Image source={{uri : track.artwork}} style={styles.playAudio_image}/>
              <View style={{alignItems:'flex-start', justifyContent:'center', flex:1}}>
                <TextWrap style={{ fontSize : fontPercentage(11), fontWeight:'bold'}}>{track.title}{'\n'}{track.wirter}</TextWrap>
              </View>
            </View>
            <View style={{flex:2}} />
            {/* PLAY 버튼 */}
            {!isPlaying ?
            <TouchableOpacity onPress={onTogglePlayback}>
              <View style={styles.playButton}>
                <Image source={images.playBtn} style={styles.playButton_image}/>
              </View>
            </TouchableOpacity> :
            <TouchableOpacity onPress={onTogglePlayback}>
              <View style={styles.playButton}>
                <Image source={images.pauseBtn} style={styles.playButton_image}/>
              </View>
            </TouchableOpacity>
            }
            <View style={{flex:1}} />
          </View>
        </View>
      </View>
    );
  };
  
  export default BackgroundControls;
  
  const styles = StyleSheet.create({
    root:{
      position:'absolute',
      height:screenHeight / 10.5,
      zIndex:9999,
      backgroundColor:'#f1f1f1',
      width:screenWidth,
      bottom:0
    },
    audioContainer: {
      top:0,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      width:screenWidth,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 0,
      height: screenHeight / 10,
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
    playAudio_image: {
      height: heightPercentage(50),
      width: 100,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    playButton_image: {
      height: 40,
      width: 40,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    playButton: {
      height: 30,
      width: '100%',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginBottom:heightPercentage(20),
      marginRight:20
    },
  })