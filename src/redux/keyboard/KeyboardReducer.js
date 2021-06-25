import {keyboardActionType} from './KeyboardActions';

const initKeyboard = {
  show: false,
};

export default function keyboard(state = initKeyboard, action) {
  switch (action.type) {
    case keyboardActionType.show:
      return {
        ...state,
        show: true,
      };
    case keyboardActionType.hide:
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
}
