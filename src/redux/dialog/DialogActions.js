export const dialogActionType = {
  openAction: 'dialog/openAction',
  openMessage: 'dialog/openMessage',
  openSelect: 'dialog/openSelect',
  openKakaoLogin: 'dialog/openKakaoLogin',
  openDrawer: 'dialog/openDrawer',
  openGrade: 'dialog/openGrade',
  openDrawerKeyBoard: 'dialog/openDrawer/keyBoard',
  close: 'dialog/close',
};

export const dialogError = (error, onPress) => dispatch => {
  dispatch({
    type: dialogActionType.openMessage,
    message:
      error?.data?.msg ||
      error?.message ||
      (typeof error === 'object' ? JSON.stringify(error) : error),
    close: true,
    title: '확인',
    onPress,
  });
};

export const dialogOpenMessage =
  ({label, onPress, title = '확인', message = ''}) =>
  dispatch => {
    dispatch({
      type: dialogActionType.openMessage,
      message,
      title,
      onPress,
      label,
    });
  };
export const dialogOpenGrade =
  ({
    drawerList,
    selectedArr,
    title = '',
    onPress,
    currentDrawerIndex,
    from,
    bookIdx,
    viewType,
  }) =>
  dispatch => {
    dispatch({
      type: dialogActionType.openDrawer,
      title,
      drawerList,
      selectedArr,
      currentDrawerIndex,
      onPress,
      from,
      bookIdx,
      viewType,
    });
  };
export const dialogOpenAction =
  ({titleColor, onPress, message, title = '확인', cancelTitle = '취소'}) =>
  dispatch => {
    dispatch({
      type: dialogActionType.openAction,
      onPress,
      message,
      titleColor,
      title,
      cancelTitle,
    });
  };
export const dialogOpenSelect =
  ({onPress, item}) =>
  dispatch => {
    dispatch({
      type: dialogActionType.openSelect,
      onPress,
      item,
    });
  };

export const dialogOpenKakaoLoginSelect =
  ({onPress, item}) =>
  dispatch => {
    dispatch({
      type: dialogActionType.openKakaoLogin,
      onPress,
      item,
    });
  };

export const dialogOpenDrawerSelect =
  ({
    drawerList,
    selectedArr,
    title = '',
    onPress,
    currentDrawerIndex,
    from,
    bookIdx,
    viewType,
  }) =>
  dispatch => {
    dispatch({
      type: dialogActionType.openDrawer,
      title,
      drawerList,
      selectedArr,
      currentDrawerIndex,
      onPress,
      from,
      bookIdx,
      viewType,
    });
  };

export const dialogOpenDrawerKeyBoard =
  ({
    title = '',
    buttonTitle = '확인',
    text = '',
    drawIdx,
    onPress,
    from,
    currentDrawerIndex,
    selectedArr,
    bookIdx,
    viewType,
  }) =>
  dispatch => {
    dispatch({
      type: dialogActionType.openDrawerKeyBoard,
      title,
      buttonTitle,
      text,
      drawIdx,
      onPress,
      from,
      selectedArr,
      currentDrawerIndex,
      bookIdx,
      viewType,
    });
  };

export const dialogClose = () => dispatch => {
  dispatch({
    type: dialogActionType.close,
  });
};
