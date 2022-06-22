import React, {useState, useEffect, useRef} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  NativeModules 
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import routes from '../../libs/routes';
import {
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import {requestPut, requestPost} from '../../services/network';
import {
  dialogClose,
  dialogError,
  dialogOpenAction,
} from '../../redux/dialog/DialogActions';
import {goBack, navigate} from '../../services/navigation';

export default function DialogDrawerKeyBoard({}) {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const {drawerKeyBoardDialog, drawerDialog} = useSelector(s => s.dialog);
  const [text, setText] = useState(
    drawerKeyBoardDialog.text ? drawerKeyBoardDialog.text : '',
  );
  const { StatusBarManager } = NativeModules

  useEffect(()=>{
    Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
        setStatusBarHeight(statusBarFrameData.height)
      }) : null
}, []);

const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    if (drawerKeyBoardDialog.open) {
      setText(drawerKeyBoardDialog.text);
    }
  }, [drawerKeyBoardDialog.open]);

  if (!drawerKeyBoardDialog.open) {
    return null;
  }

  const addBookDrawer = () => {
    dispatch(dialogClose());
    requestPost({
      url: consts.apiUrl + '/mypage/bookDrawer',
      body: {
        name: text,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          drawerKeyBoardDialog?.onPress();
        } else if (res.status === 'FAIL') {
          dispatch(dialogError(res.data?.msg || 'fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      });
  };

  const renameBookDrawer = () => {
    dispatch(dialogClose());
    requestPut({
      url: consts.apiUrl + '/mypage/bookDrawer',
      body: {
        drawIdx: drawerKeyBoardDialog.drawIdx,
        name: text,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          drawerKeyBoardDialog?.onPress();
        } else if (res.status === 'FAIL') {
          dispatch(dialogError(res.data?.msg || 'fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      });
  };

  const selectedBookDrawer = () => {
    dispatch(dialogClose());
    requestPost({
      url: consts.apiUrl + '/mypage/bookDrawer',
      body: {
        name: text,
      },
    })
      .then(res1 => {
        if (res1.status === 'SUCCESS') {
          dispatch(
            dialogOpenAction({
              titleColor: '#2699fb',
              cancelTitle: '확인',
              title: '바로가기',
              message: `선택한 책이 '${text}' 책서랍으로 이동되었습니다.`,
              onPress: a => {
                requestPost({
                  url: consts.apiUrl + '/mypage/bookDrawer/content',
                  body: {
                    bookIdx: drawerKeyBoardDialog?.bookIdx,
                    drawIdx: res1.data,
                    type: drawerKeyBoardDialog?.viewType,
                  },
                })
                  .then(res => {
                    if (res.status === 'SUCCESS') {
                      if (a) {
                        navigate(routes.bookDrawerDetail, {
                          drawIdx: res1.data,
                          name: text,
                          timeKey: Date.now(),
                        });
                      }
                    } else if (res.status === 'FAIL') {
                      dispatch(dialogError(res.data?.msg || 'fail'));
                    } else {
                      dispatch(dialogError('fail'));
                    }
                  })
                  .catch(error => {
                    dispatch(dialogError(error));
                  });
              },
            }),
          );
        } else if (res1.status === 'FAIL') {
          dispatch(dialogError(res1.data?.msg || 'fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      });
  };

  const moveBookDrawer = () => {
    dispatch(dialogClose());
    requestPost({
      url: consts.apiUrl + '/mypage/bookDrawer',
      body: {
        name: text,
      },
    })
      .then(res1 => {
        if (res1.status === 'SUCCESS') {
          dispatch(
            dialogOpenAction({
              titleColor: '#2699fb',
              cancelTitle: '확인',
              title: '바로가기',
              message: `선택한 책이 '${text}' 책서랍으로 이동되었습니다.`,
              onPress: a => {
                requestPut({
                  url: consts.apiUrl + '/mypage/bookDrawer/content',
                  body: {
                    contentsIdx: drawerKeyBoardDialog.selectedArr,
                    curDrawIdx: drawerKeyBoardDialog.currentDrawerIndex,
                    moveDrawIdx: res1.data,
                  },
                })
                  .then(res => {
                    if (res.status === 'SUCCESS') {
                      if (a) {
                        navigate(routes.bookDrawerDetail, {
                          drawIdx: res1.data,
                          name: text,
                          timeKey: Date.now(),
                        });
                      } else {
                        navigate(routes.bookDrawerDetail, {
                          timeKey: Date.now(),
                        });
                      }
                    } else if (res.status === 'FAIL') {
                      // error 일때 해야함
                      dispatch(dialogError(res.data?.msg || 'fail'));
                    } else {
                      dispatch(dialogError('fail'));
                    }
                  })
                  .catch(error => {
                    dispatch(dialogError(error));
                  });
              },
            }),
          );
        } else if (res1.status === 'FAIL') {
          dispatch(dialogError(res1.data?.msg || 'fail'));
        } else {
          dispatch(dialogError('fail'));
        }
      })
      .catch(error => {
        dispatch(dialogError(error));
      });
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
            style={styles.rootContainer}
            behavior={"padding"}
            //keyboardVerticalOffset={statusBarHeight}
            >
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => dispatch(dialogClose())}>
        <TouchableWithoutFeedback
          onPress={() => {
            return;
          }}>
            <View>
          
            <View style={styles.inputContainer}>
              <View
                style={{
                  width: screenWidth,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: widthPercentage(31),
                    borderBottomColor: '#c2c2c2',
                    borderRadius: 3,
                    borderBottomWidth: 4,
                    position: 'absolute',
                    top: 12,
                    alignSelf: 'center',
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: heightPercentage(30),
                    left: widthPercentage(20),
                  }}
                  onPress={() => dispatch(dialogClose())}>
                  <Image source={images.delete} style={styles.delete} />
                </TouchableOpacity>
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={styles.inputTitle}>
                  {drawerKeyBoardDialog.title ? drawerKeyBoardDialog.title : ''}
                </TextWrap>
              </View>
              <TextInput
                ref={inputRef}
                placeholder={'책서랍 이름을 최소 한 글자 이상 입력해주세요'}
                style={styles.input}
                autoFocus={true}
                multiline={true}
                maxLength={15}
                autoCapitalize="none"
                onChangeText={t => {
                  if (t.length >= 16) {
                    return;
                  }
                  setText(t);
                }}
                value={text}
              />
              <TextWrap
                style={styles.inputCount}
                font={fonts.kopubWorldDotumProLight}>
                <TextWrap
                  style={styles.inputCount}
                  font={fonts.kopubWorldDotumProBold}>
                  {text ? text.length : 0}
                </TextWrap>
                /15
              </TextWrap>
            </View>
            <TouchableOpacity
              style={
                text
                  ? drawerKeyBoardDialog.text === text
                    ? styles.disabledButtonContainer
                    : styles.buttonContainer
                  : styles.disabledButtonContainer
              }
              disabled={
                text
                  ? drawerKeyBoardDialog.text === text
                    ? true
                    : false
                  : true
              }
              onPress={
                drawerKeyBoardDialog.from === 'new'
                  ? addBookDrawer
                  : drawerKeyBoardDialog.from === 'rename'
                  ? renameBookDrawer
                  : drawerKeyBoardDialog.from === 'drawer'
                  ? moveBookDrawer
                  : selectedBookDrawer
              }>
              <TextWrap
                font={fonts.kopubWorldDotumProBold}
                style={text ? styles.complete : styles.completeDisabled}>
                {drawerKeyBoardDialog.buttonTitle
                  ? drawerKeyBoardDialog.buttonTitle
                  : ''}
              </TextWrap>
            </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  rootContainer: {
    flex : 1,
  },
  wrap: {flex: 1, justifyContent: 'flex-end'},
  inputTitle: {
    fontSize: fontPercentage(14),
    color: '#707070',
    marginTop: heightPercentage(27),
  },
  message: {
    fontSize: fontPercentage(14),
    color: '#333333',
  },
  iconContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    width: '90%',
    height: 30,
    marginVertical: 3,
    marginLeft: widthPercentage(14),
  },
  delete: {
    width: widthPercentage(14),
    height: heightPercentage(14),
    resizeMode: 'contain',
  },
  add: {
    width: widthPercentage(24),
    height: heightPercentage(24),
    resizeMode: 'contain',
  },
  input: {
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    color: colors.text,
    width: screenWidth,
    marginTop: heightPercentage(14),
    paddingLeft: widthPercentage(20),
    paddingRight: widthPercentage(28),
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    height: heightPercentage(206),
  },
  inputCount: {
    position: 'absolute',
    bottom: 14,
    right: 20,
    color: colors.black,
    fontSize: fontPercentage(11),
  },
  buttonContainer: {
    width: screenWidth,
    height: heightPercentage(55),
    backgroundColor: '#0066ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButtonContainer: {
    width: screenWidth,
    height: heightPercentage(55),
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeDisabled: {
    color: '#c6c6c6',
  },
  complete: {
    color: colors.white,
  },
});
