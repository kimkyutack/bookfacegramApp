import { dialogActionType } from './DialogActions';

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
  regionDialog: {
    open: false,
    message: '',
    onPress: null,
    title: '확인',
  },
  gradeDialogProfile: {
    open: false,
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
  actionDialog2: {
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
  moreDialog: {
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
  gatherDialog: {
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
  drawerKeyBoardDialogPW: {
    open: false,
    title: '',
    buttonTitle: '',
  },
  drawerKeyBoardDialogWD: {
    open: false,
    title: '',
    buttonTitle: '',
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
    case dialogActionType.openRegion:
      return {
        ...state,
        regionDialog: {
          open: true,
          onPress: action.onPress,
          region: action.region,
        },
      };
    case dialogActionType.openGradeProfile:
      return {
        ...state,
        gradeDialogProfile: {
          title: action.title,
          open: true,
          onPress: action.onPress,
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
    case dialogActionType.openAction2:
      return {
        ...state,
        actionDialog2: {
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
    case dialogActionType.openMore:
      return {
        ...state,
        moreDialog: {
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
    case dialogActionType.openShinchung:
      return {
        ...state,
        gatherDialog: {
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
    case dialogActionType.openDrawerKeyBoardPW:
      return {
        ...state,
        drawerKeyBoardDialogPW: {
          open: true,
          title: action.title,
          buttonTitle: action.buttonTitle,
        },
      };
    case dialogActionType.openDrawerKeyBoardWD:
      return {
        ...state,
        drawerKeyBoardDialogWD: {
          open: true,
          title: action.title,
          buttonTitle: action.buttonTitle,
        },
      };
    default:
      return state;
  }
}
