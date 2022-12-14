import {useCallback} from 'react';
import TrackPlayer, {usePlaybackState, State} from 'react-native-track-player';
import { useGettingPos } from './useProgressState';
import { useDispatch } from 'react-redux';
import { setShowPlay } from '../../../redux/audiobook/AudioAction';

//Play Pause 토글 기능 관련
export const useOnTogglePlayback = (cur, dur) => {
  const state = usePlaybackState();
  const dispatch = useDispatch();
  const isPlaying = state === State.Playing;
  const pos = useGettingPos();
  const sliderValue = parseInt(pos);

  return useCallback(() => {
    if (isPlaying) {
      dispatch(setShowPlay(false));
      TrackPlayer.pause();
    } else {
      dispatch(setShowPlay(true));
      if(sliderValue == dur || sliderValue >= dur - 2){
        TrackPlayer.seekTo(0);
        TrackPlayer.play();
      }else{
        TrackPlayer.play();
      }
    }
  }, [isPlaying]);
};