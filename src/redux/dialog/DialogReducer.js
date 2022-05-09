import {dialogActionType} from './DialogActions';

const initDialog = {
  messageDialog: {
    open: false,
    message: '',
    onPress: null,
    title: '확인',
  },
  gradeDialog: {
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
  drawerDialog: {
    open: false,
    title: '',
    drawerList: [],
    selectedArr: [],
    currentDrawerIndex: null,
    onPress: null,
    from: '',
  },
  drawerKeyBoardDialog: {
    open: false,
    title: '',
    buttonTitle: '',
    text: '',
    drawIdx: null,
    onPress: null,
    from: '',
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
    case dialogActionType.openGrade:
      return {
        ...state,
        gradeDialog: {
          title: action.title,
          open: true,
          message: action.message,
          onPress: action.onPress,
          label: action.label,
          grade: action.grade,
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
        },
      };
    case dialogActionType.openKakaoLogin:
      return {
        ...state,
        selectKakaoLoginDialog: {
          open: true,
          onPress: action.onPress,
          item: action.item,
        },
      };
    case dialogActionType.openDrawer:
      return {
        ...state,
        drawerDialog: {
          open: true,
          title: action.title,
          onPress: action.onPress,
          drawerList: action.drawerList,
          selectedArr: action.selectedArr,
          currentDrawerIndex: action.currentDrawerIndex,
          from: action.from,
          viewType: action.viewType,
          bookIdx: action.bookIdx,
        },
      };
    case dialogActionType.openDrawerKeyBoard:
      return {
        ...state,
        drawerKeyBoardDialog: {
          open: true,
          title: action.title,
          buttonTitle: action.buttonTitle,
          text: action.text,
          drawIdx: action.drawIdx,
          onPress: action.onPress,
          selectedArr: action.selectedArr,
          currentDrawerIndex: action.currentDrawerIndex,
          from: action.from,
          viewType: action.viewType,
          bookIdx: action.bookIdx,
        },
      };
    default:
      return state;
  }
}
