import {chatActionType} from './ChatActions';

const initChat = {
  length: 0,
};

export default function chat(state = initChat, action) {
  switch (action.type) {
    case chatActionType.updateLength1:
      return {
        ...state,
        length: (state.length || 0) + 1,
      };
    case chatActionType.updateLength:
      return {
        ...state,
        length: action.length,
      };
    default:
      return state;
  }
}
