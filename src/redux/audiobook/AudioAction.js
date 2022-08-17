// 액션
const SHOW_AUDIO = "audiobook/SHOW_AUDIO";

// 액션 생성 함수
export const setShowAudio = (index,code) => ({ type : SHOW_AUDIO, index, code });

// 초기값
const initialState = {
  shownum: false,
  playcode: false
};

// 리덕스 스토어값 변경
export default function showAudio(state = initialState, action) {
  switch(action.type) {
    case SHOW_AUDIO :
      return {
        ...state,
        shownum: action.index,
        playcode: action.code,
      };
    default:
      return state;
  }
}