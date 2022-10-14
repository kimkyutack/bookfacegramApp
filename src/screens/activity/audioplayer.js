import React, { useState , useEffect} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Modal,
    TouchableOpacity,
  } from 'react-native';
import TrackPlayer, { usePlaybackState,State , useProgress } from 'react-native-track-player';
import images from '../../libs/images';
import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
} from '../../services/util';
import TextWrap from '../../components/text-wrap/TextWrap';
import {useDispatch, useSelector} from 'react-redux';
import { requestPost } from '../../services/network';
import consts from '../../libs/consts';
import { AudioControls } from '../../components/audio-player';
import { useGettingPos } from '../../components/audio-player/hooks/useProgressState';
import { setShowAudio } from '../../redux/audiobook/AudioAction';


 //오디오 모달(슬라이더 포함)
  const AudioPlayer = ({
    //현재 오디오 재생 시점, 오디오 정보를 받음
    currentTime,
    track,
    userId,
    onClose,
  }) => {
    // Modal 표시
    const dispatch = useDispatch();
    const [visibleModal, setVisibleModal] = useState(true);
    const pos = useGettingPos();

    const handleClose = () => {
      TrackPlayer.seekTo(0);
      TrackPlayer.pause();
      onClose();
    };
    
    const handlehide = () => {
      dispatch(setShowAudio(false,track,1));
      onClose();
    };

    //
    // const progress = useProgress(1000);

    const [nextTime, setNextTime] = useState(0);

    //오디오 상태(멈춰있는지 재생중인지..)
    const state = usePlaybackState(); 
    const isPlaying = state === State.Playing; 

    //호출할 때 1초 지났는지 확인 
    const recordPlayTimeEverySeconde = () => {
        let curTime = Math.floor(+ new Date()/1000);
        const sliderValue = parseInt(pos);

        if (( isPlaying && curTime == nextTime )) {
          setPlayTime(sliderValue); //실행 중이고 1초 지났으면 API 호출
          setNextTime(nextTime + 1);
        }else if (curTime > nextTime) {
          setNextTime(curTime + 1);
        }
      };
    
      //재생시점 기록 API
    const setPlayTime = async (sliderValue) => {
        const formData = new FormData();
        formData.append('currentsTime', sliderValue);
        formData.append('durationTime',parseInt(track.duration));
        formData.append('memberId',userId);
        formData.append('title',track.title);

        try {
            requestPost({
            url: consts.apiUrl + '/audio/play',
            body: formData,
          })
            .then(response => {
        })
        } catch (error) {
            console.log(error);
        }
      };

      useEffect(() => {
        recordPlayTimeEverySeconde();
      },[nextTime]);
  
    return (
      //모달창
      <Modal animationType="slide" visible={visibleModal} onRequestClose={handlehide} >
        <View style={styles.root}>
          {/* 헤더 부분 */}
          <View style={header.bookInfo}>
            {/* 아래 화살표 */}
            <TouchableOpacity onPress={handlehide}  style={header.bookInfo_image}>
              <Image source={images.audio_arrow_down} style={header.bookInfo_image_arrow}/> 
            </TouchableOpacity>
            
            {/* 책 제목 */}
            <TextWrap style={header.bookInfo_bookTitle}>
              {track.title}
            </TextWrap>

            {/* 닫기 버튼 */}
            <TouchableOpacity onPress={handleClose} style={{flex:1}}>
              <Image source={images.audio_close} style={header.bookInfo_image_close}/>
            </TouchableOpacity>
          </View>


           {/* 배경 이미지 */}
          <View style={styles.mainContent}>
            {/* 백그라운드 이미지 */}
            <Image source={images.audio_bg} style={styles.mainContent_bgImage} />
            {/* 책 겉표지 이미지 */}
            <Image source={{uri:track.artwork}} style={styles.mainContent_audImage}  />
          </View>
          <View style={styles.audio_control}>
            <AudioControls currentTime={currentTime} track={track} backRate = {2}/>
          </View>
        </View>
      </Modal>
    );
  };
  
  export default AudioPlayer;

  const header = StyleSheet.create({
    bookInfo: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      height: 100,
    },
    bookInfo_bookTitle: {
      alignSelf:'center',
      marginTop: 7,
      marginLeft: 10,
      flex:4,
      textAlign: 'center',
      color: '#f9f9f9',
      fontSize: fontPercentage(17),
    },
    bookInfo_image: {
      flex:1,
      marginLeft: '4%',
    },
    bookInfo_image_arrow: {
      marginTop: 5,
      alignSelf:'center',
      width: '30%',
      height: '20%',
    } ,
    bookInfo_image_close: {
      marginTop: 8,
      alignSelf:'center',
      width: '35%',
      height: '20%',
    },
  })
  const styles = StyleSheet.create({
    root: {
      width: '100%',
      height: '100%',
      borderRadius: 1,
      backgroundColor: '#010101',
    },
    mainContent: {
        position: 'relative',
        flex:1,
        alignItems: 'center',
    },
    mainContent_bgImage:{
      marginVertical: heightPercentage(110),
      width: widthPercentage(260),
      height: heightPercentage(320),
    },
    mainContent_audImage: {
      zIndex: 999,
      position: 'absolute',
      marginTop: '40%',
      width: '32%',
      height: '15%',
    },
    audio_control: {
        paddingTop: heightPercentage(40),
        width: '100%',
        height: '28%',
      },
  })