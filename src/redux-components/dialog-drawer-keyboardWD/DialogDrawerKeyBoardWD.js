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
  Text,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {logout, unlink} from '@react-native-seoul/kakao-login';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import routes from '../../libs/routes';
import {requestDelete} from '../../services/network';
import {
  fontPercentage,
  heightPercentage,
  screenHeight,
  screenWidth,
  widthPercentage,
} from '../../services/util';
import {
  dialogClose,
  dialogError,
  dialogOpenAction,
} from '../../redux/dialog/DialogActions';
import {goBack, navigate} from '../../services/navigation';

export default function DialogDrawerKeyBoardWD({}) {
  const dispatch = useDispatch();
  const {drawerKeyBoardDialogWD} = useSelector(s => s.dialog);
  const user = useSelector(s => s.user, shallowEqual);
  const [value, SetValue] = useState(1);

  useEffect(() => {
    if (drawerKeyBoardDialogWD.open) {
      SetValue(1);
      Keyboard.dismiss();
    }
  }, [drawerKeyBoardDialogWD.open]);

  if (!drawerKeyBoardDialogWD.open) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.wrap}
        onPress={() => {
          dispatch(dialogClose());
          SetValue(1);
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
                    SetValue(1);
                  }}>
                  <Image source={images.delete} style={styles.delete} />
                </TouchableOpacity>
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={styles.inputTitle}>
                  {drawerKeyBoardDialogWD.title
                    ? drawerKeyBoardDialogWD.title
                    : ''}
                </TextWrap>
              </View>
              <TextWrap style={styles.input}>
                토핑 회원 탈퇴 전, 꼭 확인해주세요!
              </TextWrap>
              <View style={styles.deleteText}>
                <View style={styles.deleteTextInner}>
                  <TextWrap style={styles.numText}>1.</TextWrap>
                  <TextWrap style={styles.messageText}>
                    일반 회원가입 회원의 경우, 서비스에서 관리하는 모든 정보가
                    삭제되며 같은 아이디로 가입 시 신규회원으로 가입됩니다.{' '}
                  </TextWrap>
                </View>
                <View style={styles.deleteTextInner}>
                  <TextWrap style={styles.numText}>2.</TextWrap>
                  <TextWrap style={styles.messageText}>
                    간편 로그인을 통해 가입한 회원의 경우, 서비스에서 관리하는
                    모든 정보가 삭제되며 동일한 소셜 아이디로 재로그인 시
                    신규회원으로 가입됩니다.
                  </TextWrap>
                </View>
                <View style={styles.deleteTextInner}>
                  <TextWrap style={styles.numText}>3.</TextWrap>
                  <TextWrap style={styles.messageText}>
                    토핑 독후활동 및 책서랍 등 활동 내역은 모두 삭제되며, 삭제된
                    데이터는 복구되지 않습니다.
                  </TextWrap>
                </View>
                <View style={styles.deleteTextInner}>
                  <TextWrap style={styles.numText}>4.</TextWrap>
                  <TextWrap style={styles.messageText}>
                    보유하신 잔여포인트는 모두 소멸되며 복구되지 않습니다.
                  </TextWrap>
                </View>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (value === 1) {
                    SetValue(2);
                  } else {
                    SetValue(1);
                  }
                }}>
                <View>
                  <TextWrap style={styles.input}>
                    <Image
                      style={styles.radio}
                      source={
                        value === 1
                          ? images.deleteMemberNo
                          : images.deleteMemberOk
                      }
                    />
                    &nbsp;&nbsp;&nbsp;회원 탈퇴에 관한 모든 안내사항을
                    숙지하였으며,
                  </TextWrap>
                  <TextWrap style={styles.input2}>
                    &nbsp;&nbsp;&nbsp;회원 탈퇴에 동의합니다.
                  </TextWrap>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.ButtonWrap}>
              <TouchableOpacity
                style={styles.disabledButtonContainer}
                onPress={() => {
                  dispatch(dialogClose());
                  SetValue(1);
                }}>
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={styles.completeDisabled}>
                  취소
                </TextWrap>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  value === 1
                    ? styles.disabledButtonContainer
                    : styles.buttonContainer
                }
                disabled={value === 1 ? true : false}
                onPress={() => {
                  dispatch(dialogClose());
                  dispatch(
                    dialogOpenAction({
                      titleColor: '#005aff',
                      cancelTitle: '취소',
                      message: '정말로 탈퇴 하시겠습니까?',
                      onPress: a => {
                        if (a) {
                          requestDelete({
                            url: consts.apiUrl + '/mypage/info',
                          })
                            .then(res => {
                              if (res.status === 'SUCCESS') {
                                if (user.platform_type === 'kakao') {
                                  logout();
                                  dispatch({type: 'clear'});
                                } else {
                                  dispatch({type: 'clear'});
                                }
                              }
                            })
                            .catch(error => {
                              // error 일때 해야함
                              dispatch(dialogError(error));
                            });
                        }
                      },
                    }),
                  );
                }}>
                <TextWrap
                  font={fonts.kopubWorldDotumProBold}
                  style={
                    value === 1 ? styles.completeDisabled : styles.complete
                  }>
                  {drawerKeyBoardDialogWD.buttonTitle
                    ? drawerKeyBoardDialogWD.buttonTitle
                    : ''}
                </TextWrap>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
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
    paddingRight: widthPercentage(28),
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
  input2: {
    color: colors.text,
    width: screenWidth,
    paddingLeft: widthPercentage(40),
    paddingRight: widthPercentage(28),
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
  deleteText: {
    color: colors.text,
    width: screenWidth,
    marginTop: heightPercentage(20),
    paddingLeft: widthPercentage(20),
    paddingRight: widthPercentage(30),
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(14),
    lineHeight: heightPercentage(25),
  },
  deleteTextInner: {
    color: colors.text,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: heightPercentage(5),
  },
  numText: {
    color: colors.text,

    paddingRight: widthPercentage(5),
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(14),
    lineHeight: heightPercentage(25),
  },
  messageText: {
    color: colors.text,
    fontFamily: fonts.kopubWorldDotumProMedium,
    fontSize: fontPercentage(14),
    lineHeight: heightPercentage(25),
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    height: screenHeight / 1.5,
  },
  inputCount: {
    position: 'absolute',
    bottom: 14,
    right: 20,
    color: colors.black,
    fontSize: fontPercentage(11),
  },
  ButtonWrap: {
    width: screenWidth,
    height: heightPercentage(55),
    flexDirection: 'row',
  },
  buttonContainer: {
    width: '50%',
    height: '100%',
    backgroundColor: '#0066ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButtonContainer: {
    width: '50%',
    height: '100%',
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
  radio: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
