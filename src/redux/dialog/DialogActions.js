export const dialogActionType = {
  openAction: 'dialog/openAction',
  openAction2: 'dialog/openAction2',
  openMessage: 'dialog/openMessage',
  closeMessage: 'dialog/closeMessage',
  openSelect: 'dialog/openSelect',
  openKakaoLogin: 'dialog/openKakaoLogin',
  openDrawer: 'dialog/openDrawer',
  openMore: 'dialog/openMore',
  openGrade: 'dialog/openGrade',
  openPayment: 'dialog/openPayment',
  openCate: 'dialog/openCate',
  openDate: 'dialog/openDate',
  openRegion: 'dialog/openRegion',
  openShinchung: 'dialog/openShinchung',
  openResult: 'dialog/openResult',
  openCancel: 'dialog/openCancel',
  openGradeProfile: 'dialog/openGradeProfile',
  openDrawerKeyBoard: 'dialog/openDrawer/keyBoard',
  openDrawerKeyBoardPW: 'dialog/openDrawer/keyBoardPW',
  openDrawerKeyBoardWD: 'dialog/openDrawer/keyBoardWD',
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

export const dialogPayment = (error, onPress) => dispatch => {
  dispatch({
    type: dialogActionType.openPayment,
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
  ({ label, onPress, title = '확인', message = '' }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openMessage,
        message,
        title,
        onPress,
        label,
      });
    };
export const dialogOpenCancel =
  ({ orderCode, message = '' }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openCancel,
        message,
        orderCode,
      });
    };
export const dialogCloseMessage = () => dispatch => {
  dispatch({
    type: dialogActionType.closeMessage,
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
    grade,
  }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openGrade,
        title,
        drawerList,
        selectedArr,
        currentDrawerIndex,
        onPress,
        from,
        bookIdx,
        viewType,
        grade,
      });
    };
export const dialogOpenCate =
  ({
    drawerList,
    selectedArr,
    title = '',
    onPress,
    currentDrawerIndex,
    from,
    bookIdx,
    viewType,
    grade,
  }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openCate,
        title,
        drawerList,
        selectedArr,
        currentDrawerIndex,
        onPress,
        from,
        bookIdx,
        viewType,
        grade,
      });
    };
export const dialogOpenDate =
  ({
    onPress,
    date,
  }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openDate,
        onPress,
        date,
      });
    };
export const dialogOpenRegion =
  ({
    onPress,
    region,
  }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openRegion,
        onPress,
        region,
      });
    };
export const dialogOpenGradeProfile =
  ({ title = '확인', onPress }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openGradeProfile,
        title,
        onPress,
      });
    };
export const dialogOpenAction =
  ({ titleColor, onPress, message, title = '확인', cancelTitle = '취소' }) =>
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
export const dialogOpenAction2 =
  ({ titleColor, onPress, message, title = '확인', cancelTitle = '취소' }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openAction2,
        onPress,
        message,
        titleColor,
        title,
        cancelTitle,
      });
    };
export const dialogOpenSelect =
  ({ onPress, item }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openSelect,
        onPress,
        item,
      });
    };
export const dialogOpenMore =
  ({ onPress, item }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openMore,
        onPress,
        item,
      });
    };
export const dialogOpenKakaoLoginSelect =
  ({ onPress, item }) =>
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
export const dialogOpenShinchung =
  (num) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openShinchung,
        num,
      });
    };
export const dialogOpenResult =
  (num) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openResult,
        num,
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

export const dialogOpenDrawerKeyBoardPW =
  ({ title = '', buttonTitle = '등록', text = '' }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openDrawerKeyBoardPW,
        title,
        buttonTitle,
        text,
      });
    };

export const dialogOpenDrawerKeyBoardWD =
  ({ title = '', buttonTitle = '탈퇴 및 계정 삭제' }) =>
    dispatch => {
      dispatch({
        type: dialogActionType.openDrawerKeyBoardWD,
        title,
        buttonTitle,
      });
    };

export const dialogClose = () => dispatch => {
  dispatch({
    type: dialogActionType.close,
  });
};
