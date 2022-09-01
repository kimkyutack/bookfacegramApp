import {useCallback} from 'react';
import TrackPlayer, {usePlaybackState, State} from 'react-native-track-player';

//Play Pause 토글 기능 관련
export const useOnTogglePlayback = () => {
  const state = usePlaybackState();
  const isPlaying = state === State.Playing;

  return useCallback(() => {
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }, [isPlaying]);
};