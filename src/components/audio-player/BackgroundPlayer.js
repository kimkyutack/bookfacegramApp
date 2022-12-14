import React, { useEffect , useState} from 'react';
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
import TrackPlayer, { usePlaybackState,State, useProgress } from 'react-native-track-player';
import { useOnTogglePlayback } from './hooks/useOnTogglePlayback';
import { requestGet, requestPost } from '../../services/network';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import consts from '../../libs/consts';
import { setShowAudio, setShowPlay } from '../../redux/audiobook/AudioAction';

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
    //const pos = useGettingPos();
    const progress = useProgress(500);
    const pos = Math.floor(progress.position);
    //오디오 상태(멈춰있는지 재생중인지..)
    const state = usePlaybackState(); 
    const isPlaying = state === State.Playing;  
    const user = useSelector(s => s.user, shallowEqual);
    const showaudio = useSelector(state => state.showaudio);
    const dispatch = useDispatch();
    //Play, Pause 토글 이벤트
    
    //배속 세팅
    //const [curRate, setCurRate] = useState(1.0);
    //const [slider, setSlider] = useState(false);
    //const [nextTime, setNextTime] = useState(currentTime);
    const sliderValue = parseInt(pos);
    const onTogglePlayback = useOnTogglePlayback(sliderValue,track.duration);
    /*const recordPlayTimeEverySecond = () => {
      let curTime = Math.floor(+ new Date()/1000);
      const sliderValue = parseInt(pos);
      
      if (( isPlaying && curTime == nextTime )) {
        setPlayTime(sliderValue); //실행 중이고 1초 지났으면 API 호출
        setNextTime(nextTime + 1);
      }else if (curTime > nextTime) {
        setPlayTime(sliderValue); 
        setNextTime(curTime + 1);
      }
    };*/

    const showmain = async () => {
      try {
        const {data, status} = await requestGet({
          url: consts.apiUrl + '/audio/getCurrentsTime',
          query: {
            memberId: user.member_id,
            title: track.title,
          },
        });
        if (status === 'SUCCESS') {
          dispatch(setShowAudio(false,track,1,data.currents_time,1));
        }
        return status;
      } catch (error) {

      }
    };

      //재생시점 기록 API
    const setPlayTime = async () => {
        const formData = new FormData();
        formData.append('currentsTime', pos);
        formData.append('durationTime',parseInt(track.duration));
        formData.append('memberId', user.member_id);
        formData.append('title',track.title);
     
        try {
            requestPost({
            url: consts.apiUrl + '/audio/play',
            body: formData,
          })
            .then(response => {
        })
        } catch (error) {
        }
      };
      //재생 시간 변할 시 재생 시점 기록 함수 호출
      useEffect(() => {
        //recordPlayTimeEverySecond();
        setPlayTime();
      },[pos]);

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
          //console.log(error);
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
          if(showaudio.playnow === false){
            TrackPlayer.stop(); 
          }else{
            TrackPlayer.play(); 
          }
          //setSlider(true);
        }catch(error){
          //console.log(error);
        }
      })();
    }, []);

    useEffect(() => {
      dispatch(setShowPlay(isPlaying));
    },[isPlaying])

    return (
      <View style={styles.root}>
        {/* 오디오 컨트롤 */}
        <View style={styles.audioContainer}>
          {/* 슬라이더 */}
          <BackSeekBar />
          {/* 오디오 컨트롤 패널 */}
          <TouchableOpacity style={styles.container} onPress={() => showmain()}>
            {/* White Space */}
            <View style={{flex:6,alignItems:'center',flexDirection:'row'}}>
              <Image source={{uri : track.artwork}} style={styles.playAudio_image}/>
              <View style={{alignItems:'flex-start', justifyContent:'center',  flexDirection:'column'}}>
                <TextWrap style={{ fontSize : fontPercentage(12), fontWeight:'bold', flex:1.5}}>{track.title}</TextWrap>
                <TextWrap style={{ fontSize : fontPercentage(10),  flex:1}}>{track.wirter}</TextWrap>
              </View>
            </View>
            <View style={{flex:2}} />
            {/* PLAY 버튼 */}
            {!isPlaying ?
            <TouchableOpacity onPress={onTogglePlayback} style={{flex:1,height:'100%', alignItems:'center',zIndex:500}}>
              <View style={styles.playButton}>
                <Image source={images.playBtn} style={styles.playButton_image}/>
              </View>
            </TouchableOpacity> :
            <TouchableOpacity onPress={onTogglePlayback} style={{flex:1,height:'100%', alignItems:'center',zIndex:500}}>
              <View style={styles.playButton}>
                <Image source={images.pauseBtn} style={styles.playButton_image}/>
              </View>
            </TouchableOpacity>
            }
            <View style={{flex:0.6}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  export default BackgroundControls;
  
  const styles = StyleSheet.create({
    root:{
      position:'absolute',
      height:screenHeight / 10.6,
      zIndex:9999,
      backgroundColor:'#f1f1f1',
      width:screenWidth,
      bottom:0,
      alignItems:'center',
      justifyContent:'center'
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
      height: '80%',
      justifyContent:'center',
      paddingBottom:'6%',
      zIndex:300
    },
    playAudio_image: {
      height: screenHeight / 11.5,
      width: '30%',
      resizeMode:'stretch',
    },
    playButton_image: {
      height: '60%',
      width: '40%',
      resizeMode:'stretch',
    },
    playButton: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })