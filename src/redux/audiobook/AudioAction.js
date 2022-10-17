// 액션
const SHOW_AUDIO = "audiobook/SHOW_AUDIO";
const SHOW_WHAT = "audiobook/SHOW_WHAT";

// 액션 생성 함수
export const setShowAudio = (index,track,start,current) => ({ type : SHOW_AUDIO, index, track, start, current });
export const setShowWhat = (index) => ({ type : SHOW_WHAT, index});

// 초기값
const initialState = {
  shownum: false,
  track: false,
  playstart: 0,
  current: 0,
  showwt: false,
};

// 리덕스 스토어값 변경
export default function showAudio(state = initialState, action) {
  switch(action.type) {
    case SHOW_AUDIO :
      return {
        ...state,
        shownum: action.index,
        track: action.track,
        playstart: action.start,
        current: action.current
      };
    case SHOW_WHAT :
      return {
        ...state,
        showwt: action.index,
      };
    default:
      return state;
  }
}