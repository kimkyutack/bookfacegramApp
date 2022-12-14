import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import ButtonBox from '../../components/button-box/ButtonBox';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputPhone from '../../components/input-phone/InputPhone';
import InputWrap from '../../components/input-wrap/InputWrap';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import routes from '../../libs/routes';
import {dialogOpenMessage, dialogError, dialogOpenAction} from '../../redux/dialog/DialogActions';
import {userCheckToken} from '../../redux/user/UserActions';
import {goBack, reset, navigate} from '../../services/navigation';
import {requestGet, requestPost} from '../../services/network';
import {setItem} from '../../services/preference';
import {
  containPasswordCheck,
  preventKor,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';

export default function RegisterFormInfo({navigation}) {
  const scrollRef = useRef();
  const {params} = useRoute();
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [name, setName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [memberIdError, setMemberIdError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // sns ????????? ?????? ?????????
    // setEmail(params.email);
    // setName(
    //   params.firstName && params.lastName
    //     ? `${params.firstName} ${params.lastName}`
    //     : '',
    // );
    // setStudentId(params.studentId);
    // if (params.phone) {
    //   setPhoneExt(params.phone.split(' ')[0].replace('+', ''));
    //   setPhone(params.phone.split(' ')[1]);
    // }
  }, [params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setMemberId('');
      setPassword('');
      setName('');
      setPasswordConfirm('');
      setPhone('');
      setEmail('');
      setPasswordConfirmError('');
      setEmailError('');
      setMemberIdError('');
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (password && passwordConfirm && password === passwordConfirm) {
      setPasswordConfirmError('');
    } else if (password && passwordConfirm && password !== passwordConfirm) {
      setPasswordConfirmError('??????????????? ???????????? ????????????.');
    }
  }, [password, passwordConfirm]);

  useEffect(() => {
    if (
      password &&
      (password.length < 8 || password.length > 20) &&
      !containPasswordCheck(password)
    ) {
      setPasswordError('8~20?????? ??????+??????+???????????? ??????');
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
      setPasswordConfirmError('8~20?????? ??????+??????+???????????? ??????');
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
    if (user.signed) {
      if (user.intro_setting) {
        reset(routes.home);
      } else {
        navigate(routes.intro1, {age: user.age, initGrade: user.grade});
      }
    }
  }, [user.signed]);

  const signUp = async () => {
    Keyboard.dismiss();
    // ?????? ????????? ?????? ????????? ???????????? ????????? ????????? ???????????? ??????????????????
    try {
      const memberIdDuplicatedCheck = await requestGet({
        url: consts.apiUrl + '/auth/validMemberId',
        query: {
          memberId: memberId,
        },
      });
      const emailDuplicatedCheck = await requestGet({
        url: consts.apiUrl + '/auth/validEmail',
        query: {
          email: email,
        },
      });
      if (
        memberIdDuplicatedCheck.status === 'SUCCESS' &&
        emailDuplicatedCheck.status === 'SUCCESS'
      ) {
        signUpProcess();
      }
    } catch (e) {
      dispatch(
        dialogOpenMessage({
          message:
            e?.data?.msg ||
            e?.message ||
            (typeof e === 'object' ? JSON.stringify(e) : e),
        }),
      );
    }
  };

  const signUpProcess = async () => {
    try {
      const {data, status} = await requestPost({
        url: consts.apiUrl + '/auth/memberJoin',
        body: {
          memberId: memberId,
          password: password,
          korNm: name,
          handphone: phone,
          email: email,
          agreeEmail: params.allowEmail === true ? 1 : 0,
          agreeSms: params.sms === true ? 1 : 0,
          agreeAppPush: params.appPush === true ? 1 : 0,
        },
      });

      if (status === 'SUCCESS') {
        await setItem('accessToken', data.accessToken);
        await setItem('refreshToken', data.refreshToken);
        await setItem('platformType', 'app');
        dispatch(
          dialogOpenMessage({message: '??????????????? ??????????????? ?????????????????????.'}),
        );
        dispatch(userCheckToken);
      } else {
        dispatch(dialogError({message: '?????? ?????? ??????'}));
      }
    } catch (error) {
      dispatch(
        dialogOpenMessage({
          message:
            error?.data?.msg ||
            error?.message ||
            (typeof error === 'object' ? JSON.stringify(error) : error),
        }),
      );
    }
  };

  const memberIdDuplicatedCheck = async e => {
    let preventKorReg = /[^A-Za-z0-9]/gi;
    setMemberId(e.replace(preventKorReg, ''));
    if (e && e.length < 6) {
      setMemberIdError('6?????? ?????? ??????????????????.');
      return;
    } else if (e && e.length >= 6) {
      setMemberIdError('');
    }
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/auth/validMemberId',
        query: {
          memberId: e,
        },
      });
      if (status === 'FAIL') {
        // ?????? ??????
        setMemberIdError('????????? ???????????? ????????? ??????????????????.');
      }
      setLoading(false);
    } catch (error) {
      setMemberIdError(
        error?.data?.msg ||
          error?.message ||
          (typeof error === 'object' ? JSON.stringify(error) : error),
      );
      setLoading(false);
    }
  };

  const emailDuplicatedCheck = async e => {
    let preventKorReg = /[^A-Za-z0-9@.]/gi;
    let emailFormatReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormatReg.test(e) === false) {
      setEmail(e.replace(preventKorReg, ''));
      setEmailError('????????? ????????? ?????? ????????????. ex) toaping@naver.com');
    } else {
      setEmail(e.replace(preventKorReg, ''));
      setEmailError('');
    }
    try {
      if (!emailError) {
        setEmailLoading(true);
        const {data, status} = await requestGet({
          url: consts.apiUrl + '/auth/validEmail',
          query: {
            email: e,
          },
        });
        if (status === 'SUCCESS') {
          if (emailFormatReg.test(e)) {
            setEmailError('');
          } else {
            setEmailError('????????? ????????? ?????? ????????????. ex) toaping@naver.com');
          }
        }
        setEmailLoading(false);
      }
    } catch (error) {
      setEmailError(
        error?.data?.msg ||
          error?.message ||
          (typeof error === 'object' ? JSON.stringify(error) : error),
      );
      setEmailLoading(false);
    }
  };
  const buttonDisabled =
    !name ||
    !memberId ||
    !password ||
    !passwordConfirm ||
    !phone ||
    !email ||
    Boolean(emailError) ||
    Boolean(memberIdError) ||
    Boolean(passwordConfirmError);

  return (
    <RootLayout
      topbar={{
        title: '?????? ????????????',
        none: true,
      }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.root}>
        <TextWrap style={styles.subTitle}>
          ??????????????? ????????? ???????????? ????????? ?????????????????????{'\n'}
          ???????????? ????????? ??????????????? ????????? ??????????????? ???????????????.
        </TextWrap>
        <TextWrap style={styles.label} font={fonts.kopubWorldDotumProBold}>
          2.???????????? ??????
        </TextWrap>

        <View style={styles.forms}>
          <InputWrap
            style={styles.input}
            inputStyle={styles.inputValue}
            onChange={setName}
            value={name}
            placeholder="??????(??????)"
            placeholderTextColor="#acacac"
            maxLength={20}
          />
          <InputWrap
            style={[styles.input, {marginTop: 30}]}
            inputStyle={styles.inputValue}
            onChange={memberIdDuplicatedCheck}
            value={memberId}
            placeholder="?????????(??????)"
            placeholderTextColor="#acacac"
            maxLength={20}
            message={
              memberId
                ? loading
                  ? '???????????? ????????????.'
                  : memberIdError
                  ? memberIdError
                  : '?????? ????????? ??????????????????.'
                : '????????? ?????????(?????? ?????????)??? ??????????????????.'
            }
            messageColor={
              memberId
                ? loading
                  ? colors.black
                  : memberIdError
                  ? colors.red
                  : colors.blue
                : colors.black
            }
          />
          <InputWrap
            style={styles.input}
            inputStyle={styles.inputValue}
            value={password}
            onChange={setPassword}
            secure
            maxLength={20}
            placeholder="????????????(??????)"
            placeholderTextColor="#acacac"
            message={
              passwordError
                ? passwordError
                : !password
                ? '8~20?????? ??????+??????+???????????? ??????'
                : '?????????????????????.'
            }
            messageColor={
              password
                ? passwordError
                  ? colors.red
                  : colors.blue
                : colors.black
            }
          />
          <InputWrap
            style={styles.input}
            inputStyle={styles.inputValue}
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            secure
            maxLength={20}
            placeholderTextColor="#acacac"
            placeholder="???????????? ??????(??????)"
            message={
              passwordConfirmError
                ? passwordConfirmError
                : !passwordConfirm
                ? '8~20?????? ??????+??????+???????????? ??????'
                : '??????????????? ???????????????.'
            }
            messageColor={
              passwordConfirm
                ? passwordConfirmError
                  ? colors.red
                  : colors.blue
                : colors.black
            }
          />

          <InputWrap
            style={styles.input}
            inputStyle={styles.inputValue}
            value={phone}
            onChange={setPhone}
            maxLength={11}
            placeholder="???????????????(??????)"
            placeholderTextColor="#acacac"
            number
            message={
              phone.length === 11 ? '?????????????????????.' : '-?????? ????????? ??????'
            }
            messageColor={phone.length === 11 ? colors.blue : colors.black}
          />
          <InputWrap
            style={styles.input}
            inputStyle={styles.inputValue}
            onChange={emailDuplicatedCheck}
            value={email}
            placeholder="????????? ??????(??????)"
            placeholderTextColor="#acacac"
            message={
              email
                ? emailLoading
                  ? '???????????? ????????????.'
                  : emailError
                  ? emailError
                  : '?????? ????????? ??????????????????.'
                : 'ex) toaping@naver.com'
            }
            messageColor={
              email
                ? emailLoading
                  ? colors.black
                  : emailError
                  ? colors.red
                  : colors.blue
                : colors.black
            }
          />
        </View>
        <View style={styles.buttonWrap}>
          <ButtonWrap
            // disabled={buttonDisabled}
            onPress={() => dispatch(
                dialogOpenAction({
                  titleColor: colors.blue,
                  cancelTitle: '??????',
                  message: '??????????????? ??????????????????????????',
                  onPress: a => {
                    if (a) {
                      navigate(routes.login);
                    }
                  },
                }),
              )}
            style={styles.button}
            outline
            styleTitle={styles.buttonTitle}>
            ??????
          </ButtonWrap>
          <ButtonWrap
            disabled={buttonDisabled}
            onPress={signUp}
            style={buttonDisabled ? styles.diabledButton : styles.button}
            styleTitle={
              buttonDisabled ? styles.buttonTitle1 : styles.buttonTitle2
            }
            disabledBackgroundColor={
              !buttonDisabled && styles.buttonBackground
            }>
            ????????????
          </ButtonWrap>
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, paddingHorizontal: 16},

  forms: {
    flex: 1,
  },
  input: {
    marginTop: 20,
    color: colors.black,
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
  title: {
    marginHorizontal: 16,
    fontSize: 22,
    marginTop: 20,
    lineHeight: 26,
    color: '#222',
  },
  subTitle: {
    backgroundColor: '#fbfbfb',
    paddingVertical: 10,
    textAlign: 'center',
    color: '#333333',
    fontSize: fontPercentage(10),
    lineHeight: fontPercentage(14),
  },
  label: {
    marginTop: 11,
    fontSize: fontPercentage(15),
    color: '#222',
  },
  buttonWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 30,
    paddingVertical: 1,
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: widthPercentage(130),
    height: heightPercentage(43),
  },
  diabledButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: widthPercentage(130),
    height: heightPercentage(43),
    backgroundColor: '#c9c9c9',
  },
  buttonTitle: {
    fontSize: fontPercentage(15),
    lineHeight: fontPercentage(23),
    color: colors.border,
    backgroundColor: 'transparent',
  },
  buttonTitle1: {
    fontSize: fontPercentage(15),
    lineHeight: fontPercentage(23),
    backgroundColor: 'transparent',
    color: colors.white,
  },
  buttonTitle2: {
    fontSize: fontPercentage(15),
    lineHeight: fontPercentage(23),
    backgroundColor: 'transparent',
    color: colors.white,
  },
  buttonBackground: {
    backgroundColor: colors.prussianBlue,
  },
});
