import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  KeyboardAvoidingView,
  NativeModules,
  Platform
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import InputWrap2 from '../../components/input-wrap/InputWrap2';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import {
  containPasswordCheck,
  fontPercentage,
  heightPercentage,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import {requestPut} from '../../services/network';
import {dialogClose, dialogError} from '../../redux/dialog/DialogActions';

export default function DialogDrawerKeyBoardPW({}) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const {drawerKeyBoardDialogPW, drawerDialog} = useSelector(s => s.dialog);

  const { StatusBarManager } = NativeModules;

  useEffect(() => {
    Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
      setStatusBarHeight(statusBarFrameData.height)
    }) : null
  }, []);

  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    if (password && passwordConfirm && password === passwordConfirm) {
      setPasswordConfirmError('');
    } else if (password && passwordConfirm && password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    }
  }, [password, passwordConfirm]);

  useEffect(() => {
    if (
      password &&
      (password.length < 8 || password.length > 20) &&
      !containPasswordCheck(password)
    ) {
      setPasswordError('8~20자리 영문+숫자+특수문자 조합');
    } else if (
      password &&
      password.length >= 8 &&
      password.length < 20 &&
      containPasswordCheck(password)
    ) {
      setPasswordError('');
    }
  }, [password]);

  useEffect(() => {
    if (
      passwordConfirm &&
      (passwordConfirm.length < 8 || passwordConfirm.length > 20)
    ) {
      setPasswordConfirmError('8~20자리 영문+숫자+특수문자 조합');
    } else if (
      passwordConfirm &&
      passwordConfirm.length >= 8 &&
      passwordConfirm.length < 20 &&
      password === passwordConfirm
    ) {
      setPasswordConfirmError('');
    }
  }, [passwordConfirm]);

  useEffect(() => {
    if (drawerKeyBoardDialogPW.open) {
    }
  }, [drawerKeyBoardDialogPW.open]);

  if (!drawerKeyBoardDialogPW.open) {
    return null;
  }

  const updatePwd = () => {
    dispatch(dialogClose());
    requestPut({
      url: consts.apiUrl + '/mypage/info/password',
      body: {
        password: password,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          dispatch(dialogError('수정되었습니다.'));
          setPassword('');
          setPasswordConfirm('');
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

  const buttonDisabled =
    !password || !passwordConfirm || Boolean(passwordConfirmError);

  return (
    <SafeAreaView style={styles.root}>
      {
        Platform.OS === 'ios' ? (
          <KeyboardAvoidingView
            style={styles.rootContainer}
            behavior={"padding"}
          >
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => {
          dispatch(dialogClose());
          setPassword('');
          setPasswordConfirm('');
        }}>
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
                  onPress={() => {
                    dispatch(dialogClose());
                    setPassword('');
                    setPasswordConfirm('');
                  }}>
                  <Image source={images.delete} style={styles.delete} />
                </TouchableOpacity>
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={styles.inputTitle}>
                  {drawerKeyBoardDialogPW.title
                    ? drawerKeyBoardDialogPW.title
                    : ''}
                </TextWrap>
              </View>
              <InputWrap2
                style={styles.input}
                inputStyle={styles.inputValue}
                value={password}
                onChange={setPassword}
                secure
                maxLength={20}
                onChangeText={t => {
                  if (t.length >= 21) {
                    return;
                  }
                }}
                placeholder="새 비밀번호를 입력하세요."
                placeholderTextColor="#acacac"
                message={
                  passwordError
                    ? passwordError
                    : !password
                    ? '8~20자리 영문+숫자+특수문자 조합'
                    : '정상입력입니다.'
                }
                messageColor={
                  password
                    ? passwordError
                      ? colors.red
                      : colors.blue
                    : colors.black
                }
              />
              <InputWrap2
                style={styles.input}
                inputStyle={styles.inputValue}
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                autoFocus={true}
                secure
                maxLength={20}
                placeholderTextColor="#acacac"
                placeholder="새 비밀번호를 한번 더 입력하세요."
                onChangeText={t => {
                  if (t.length >= 21) {
                    return;
                  }
                }}
                message={
                  passwordConfirmError
                    ? passwordConfirmError
                    : !passwordConfirm
                    ? '비밀번호가 일치하지 않습니다.'
                    : '비밀번호가 일치합니다.'
                }
                messageColor={
                  passwordConfirm
                    ? passwordConfirmError
                      ? colors.red
                      : colors.blue
                    : colors.black
                }
              />
            </View>
            <TouchableOpacity
              style={
                buttonDisabled
                  ? styles.disabledButtonContainer
                  : styles.buttonContainer
              }
              disabled={buttonDisabled}
              onPress={updatePwd}>
              <TextWrap
                font={fonts.kopubWorldDotumProBold}
                style={
                  !buttonDisabled ? styles.complete : styles.completeDisabled
                }>
                {drawerKeyBoardDialogPW.buttonTitle
                  ? drawerKeyBoardDialogPW.buttonTitle
                  : ''}
              </TextWrap>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
      </KeyboardAvoidingView>
        ) : (
        <TouchableOpacity
          style={styles.wrap}
          onPress={() => {
            dispatch(dialogClose());
            setPassword('');
            setPasswordConfirm('');
          }}>
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
                    onPress={() => {
                      dispatch(dialogClose());
                      setPassword('');
                      setPasswordConfirm('');
                    }}>
                    <Image source={images.delete} style={styles.delete} />
                  </TouchableOpacity>
                  <TextWrap
                    font={fonts.kopubWorldDotumProBold}
                    style={styles.inputTitle}>
                    {drawerKeyBoardDialogPW.title
                      ? drawerKeyBoardDialogPW.title
                      : ''}
                  </TextWrap>
                </View>
                <InputWrap2
                  style={styles.input}
                  inputStyle={styles.inputValue}
                  value={password}
                  onChange={setPassword}
                  secure
                  maxLength={20}
                  onChangeText={t => {
                    if (t.length >= 21) {
                      return;
                    }
                  }}
                  placeholder="새 비밀번호를 입력하세요."
                  placeholderTextColor="#acacac"
                  message={
                    passwordError
                      ? passwordError
                      : !password
                      ? '8~20자리 영문+숫자+특수문자 조합'
                      : '정상입력입니다.'
                  }
                  messageColor={
                    password
                      ? passwordError
                        ? colors.red
                        : colors.blue
                      : colors.black
                  }
                />
                <InputWrap2
                  style={styles.input}
                  inputStyle={styles.inputValue}
                  value={passwordConfirm}
                  onChange={setPasswordConfirm}
                  autoFocus={true}
                  secure
                  maxLength={20}
                  placeholderTextColor="#acacac"
                  placeholder="새 비밀번호를 한번 더 입력하세요."
                  onChangeText={t => {
                    if (t.length >= 21) {
                      return;
                    }
                  }}
                  message={
                    passwordConfirmError
                      ? passwordConfirmError
                      : !passwordConfirm
                      ? '비밀번호가 일치하지 않습니다.'
                      : '비밀번호가 일치합니다.'
                  }
                  messageColor={
                    passwordConfirm
                      ? passwordConfirmError
                        ? colors.red
                        : colors.blue
                      : colors.black
                  }
                />
              </View>
              <TouchableOpacity
                style={
                  buttonDisabled
                    ? styles.disabledButtonContainer
                    : styles.buttonContainer
                }
                disabled={buttonDisabled}
                onPress={updatePwd}>
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={
                    !buttonDisabled ? styles.complete : styles.completeDisabled
                  }>
                  {drawerKeyBoardDialogPW.buttonTitle
                    ? drawerKeyBoardDialogPW.buttonTitle
                    : ''}
                </TextWrap>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
        ) }
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
    flex: 1,
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
    paddingTop: heightPercentage(14),
    paddingLeft: widthPercentage(20),
    paddingRight: widthPercentage(20),
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    height: heightPercentage(256),
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
  inputValue: {
    color: colors.black,
    padding: 0,
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(20),
    letterSpacing: -0.5,
    textDecorationLine: 'none',
    fontFamily: fonts.kopubWorldDotumProMedium,
  },
});
