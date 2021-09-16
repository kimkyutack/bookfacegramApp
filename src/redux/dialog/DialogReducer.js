import {dialogActionType} from './DialogActions';

const initDialog = {
  messageDialog: {
    open: false,
    message: '',
    onPress: null,
    title: '확인',
  },
  actionDialog: {
    open: false,
    onPress: null,
    message: '',
    title: '',
    cancelTitle: '',
  },
  selectDialog: {
    open: false,
    onPress: null,
    item: [],
    title: '',
    cancelTitle: '',
  },
  selectKakaoLoginDialog: {
    open: false,
    onPress: null,
    item: [],
    title: '',
    cancelTitle: '',
  },
};

export default function dialog(state = initDialog, action) {
  switch (action.type) {
    case dialogActionType.close:
      return initDialog;
    case dialogActionType.openMessage:
      return {
        ...state,
        messageDialog: {
          title: action.title,
          open: true,
          message: action.message,
          onPress: action.onPress,
          label: action.label,
        },
      };
    case dialogActionType.openAction:
      return {
        ...state,
        actionDialog: {
          open: true,
          onPress: action.onPress,
          message: action.message,
          titleColor: action.titleColor,
          title: action.title,
          cancelTitle: action.cancelTitle,
        },
      };
    case dialogActionType.openSelect:
      return {
        ...state,
        selectDialog: {
          open: true,
          onPress: action.onPress,
          item: action.item,
          titleColor: action.titleColor,
          title: action.title,
          cancelTitle: action.cancelTitle,
        },
      };
    case dialogActionType.openKakaoLogin:
      return {
        ...state,
        selectKakaoLoginDialog: {
          open: true,
          onPress: action.onPress,
          item: action.item,
          titleColor: action.titleColor,
          title: action.title,
          cancelTitle: action.cancelTitle,
        },
      };
    default:
      return state;
  }
}
