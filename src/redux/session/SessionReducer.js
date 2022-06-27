import { SessionActionType } from "./SessionAction";

const initSession = {
  referer: 'NEWBOOKS(메인페이지)',
  sessionTime: '000000',
};

export default function session(state = initSession, action) {
  //alert(action.selectType);
  switch (action.type) {
    case SessionActionType.main:
      return {
        ...state,
      };
    case SessionActionType.init:
      return {
        ...state,
        referer: action.referer,
        sessionTime: '000000',
      };
    case SessionActionType.active:
      return {
        ...state,
        referer: action.referer,
        sessionTime: action.sessionTime,
      };
    default:
      return state;
  }
}
