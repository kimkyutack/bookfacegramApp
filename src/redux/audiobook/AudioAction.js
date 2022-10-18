// 액션
const SHOW_AUDIO = "audiobook/SHOW_AUDIO";
const SHOW_WHAT = "audiobook/SHOW_WHAT";
const SHOW_MAIN = "audiobook/SHOW_MAIN";

// 액션 생성 함수
export const setShowAudio = (index,track,start,current,main) => ({ type : SHOW_AUDIO, index, track, start, current, main });
export const setShowMain = (start, backstart) => ({ type : SHOW_MAIN, start, backstart});
export const setShowWhat = (index) => ({ type : SHOW_WHAT, index});


// 초기값
const initialState = {
  shownum: false,
  track: false,
  playstart: 0,
  startmain: 0,
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
        current: action.current,
        startmain: action.main
      };
    case SHOW_MAIN :
      return {
        ...state,
        startmain: action.start,
        playstart: action.backstart
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