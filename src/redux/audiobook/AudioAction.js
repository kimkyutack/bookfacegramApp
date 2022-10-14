// 액션
const SHOW_AUDIO = "audiobook/SHOW_AUDIO";

// 액션 생성 함수
export const setShowAudio = (index,track,start) => ({ type : SHOW_AUDIO, index, track, start });

// 초기값
const initialState = {
  shownum: false,
  track: false,
  playstart: 0,
};

// 리덕스 스토어값 변경
export default function showAudio(state = initialState, action) {
  switch(action.type) {
    case SHOW_AUDIO :
      return {
        ...state,
        shownum: action.index,
        track: action.track,
        playstart: action.start
      };
    default:
      return state;
  }
}