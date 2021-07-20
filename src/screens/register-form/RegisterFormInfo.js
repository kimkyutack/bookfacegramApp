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
import image from '../../libs/image';
import routes from '../../libs/routes';
import {dialogOpenMessage, dialogError} from '../../redux/dialog/DialogActions';
import {userCheckToken} from '../../redux/user/UserActions';
import {goBack, reset} from '../../services/navigation';
import {requestGet, requestPost} from '../../services/network';
import {setItem} from '../../services/preference';
import {containPasswordCheck, preventKor} from '../../services/util';
import Policy from './Policy';

export default function RegisterFormInfo({}) {
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

  console.log(params);
  useEffect(() => {
    // sns 로그인 일때 필요함
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
      setPasswordError('8~20자리 영문소문자+숫자 조합');
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
      setPasswordConfirmError('8~20자리 영문소문자+숫자 조합');
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
      reset(routes.home);
    }
  }, [user.signed]);

  const signUp = async () => {
    Keyboard.dismiss();
    // 최종 로그인 버튼 클릭시 다시한번 이메일 아이디 중복체크 세마포어방지
    const memberIdDuplicatedCheck = await requestGet({
      url: consts.apiUrl + '/memberIdChk',
      query: {
        member_id: memberId,
        platform_type: 'app',
      },
    });
    const emailDuplicatedCheck = await requestGet({
      url: consts.apiUrl + '/memberEmailChk',
      query: {
        email: email,
      },
    });
    if (memberIdDuplicatedCheck.valid && emailDuplicatedCheck.valid) {
      signUpProcess();
    } else if (!memberIdDuplicatedCheck.valid) {
      setMemberIdError('중복된 아이디로 사용이 불가능합니다.');
    } else if (!emailDuplicatedCheck.valid) {
      setEmailError('중복된 이메일로 사용이 불가능합니다.');
    } else if (!memberIdDuplicatedCheck.valid && !emailDuplicatedCheck.valid) {
      setMemberIdError('중복된 아이디로 사용이 불가능합니다.');
      setEmailError('중복된 이메일로 사용이 불가능합니다.');
    }
  };

  const signUpProcess = async () => {
    try {
      await requestPost({
        url: consts.apiUrl + '/memberJoin',
        body: {
          member_id: memberId,
          password: password,
          platform_type: 'app',
          kor_nm: name,
          handphone: phone,
          email: email,
          agree_email: params.allowEmail === true ? 1 : 0,
          agree_sms: params.sms === true ? 1 : 0,
          agree_app_push: params.appPush === true ? 1 : 0,
        },
      });
      const token = await requestPost({
        url: consts.apiUrl + '/makeJwt',
        body: {
          member_id: memberId,
          password: password,
          platform_type: 'app',
        },
      });
      if (token.valid) {
        await setItem('token', token.token);
        await setItem('platformType', 'app');
        dispatch(
          dialogOpenMessage({message: '회원가입이 정상적으로 완료되었습니다.'}),
        );
        dispatch(userCheckToken);
      } else {
        dispatch(dialogError({message: '토큰 생성 에러'}));
      }
    } catch (error) {
      dispatch(dialogOpenMessage({message: error.message || error}));
    }
  };

  const memberIdDuplicatedCheck = async e => {
    let preventKorReg = /[^A-Za-z0-9]/gi;
    setMemberId(e.replace(preventKorReg, ''));
    if (e && e.length < 6) {
      setMemberIdError('6자리 이상 입력해주세요.');
      return;
    } else if (e && e.length >= 6) {
      setMemberIdError('');
    }
    try {
      setLoading(true);
      const duplicatedCheck = await requestGet({
        url: consts.apiUrl + '/memberIdChk',
        query: {
          member_id: e,
          platform_type: 'app',
        },
      });
      if (!duplicatedCheck.valid) {
        // 중복 아님
        setMemberIdError('중복된 아이디로 사용이 불가능합니다.');
      }
      setLoading(false);
    } catch (error) {
      dispatch(
        dialogError({
          message: 'network error',
        }),
      );
      reset(routes.login);
      setLoading(false);
    }
  };

  const emailDuplicatedCheck = async e => {
    let preventKorReg = /[^A-Za-z0-9@.]/gi;
    let emailFormatReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormatReg.test(e) === false) {
      setEmail(e.replace(preventKorReg, ''));
      setEmailError('이메일 형식이 맞지 않습니다. ex) toaping@naver.com');
    } else {
      setEmail(e.replace(preventKorReg, ''));
      setEmailError('');
    }
    try {
      if (!emailError) {
        setEmailLoading(true);
        const duplicatedCheck = await requestGet({
          url: consts.apiUrl + '/memberEmailChk',
          query: {
            email: e,
          },
        });
        if (!duplicatedCheck.valid) {
          setEmailError('중복된 이메일로 사용이 불가능합니다.');
        }
        setEmailLoading(false);
      }
    } catch (error) {
      dispatch(
        dialogError({
          message: 'network error',
        }),
      );
      reset(routes.login);
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
        title: '토핑 회원가입',
        back: true,
      }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.root}>
        <TextWrap style={styles.subTitle}>
          회원가입에 필요한 최소한의 정보만 입력받음으로써{'\n'}
          개인정보 수집을 최소화하고 편리한 회원가입을 제공합니다.
        </TextWrap>
        <TextWrap style={styles.label} font={fonts.robotoMedium}>
          2.개인정보 입력
        </TextWrap>

        <View style={styles.forms}>
          <InputWrap
            style={styles.input}
            onChange={setName}
            value={name}
            placeholder="이름(필수)"
            maxLength={20}
          />
          <InputWrap
            style={[styles.input, {marginTop: 30}]}
            onChange={memberIdDuplicatedCheck}
            value={memberId}
            placeholder="아이디(필수)"
            maxLength={20}
            message={
              memberId
                ? loading
                  ? '중복체크 중입니다.'
                  : memberIdError
                  ? memberIdError
                  : '사용 가능한 아이디입니다.'
                : '사용할 아이디(또는 이메일)을 입력해주세요.'
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
            value={password}
            onChange={setPassword}
            secure
            maxLength={20}
            // borderColor={Boolean(passwordError) && colors.red}
            placeholder="비밀번호(필수)"
            message={
              passwordError
                ? passwordError
                : !password
                ? '8~20자리 영문소문자+숫자 조합'
                : '정상입니다.'
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
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            secure
            maxLength={20}
            // borderColor={Boolean(passwordConfirmError) && colors.red}
            placeholder="비밀번호 확인(필수)"
            message={
              passwordConfirmError
                ? passwordConfirmError
                : !passwordConfirm
                ? '8~20자리 영문소문자+숫자 조합'
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

          <InputWrap
            style={styles.input}
            value={phone}
            onChange={setPhone}
            maxLength={11}
            placeholder="핸드폰번호(필수)"
            number
            message={phone ? 'ex) 01033334444' : '-없이 숫자만 입력'}
            messageColor={phone ? colors.blue : colors.black}
          />
          <InputWrap
            style={styles.input}
            // onChange={e => emailDuplicatedCheck(e)}
            onChange={emailDuplicatedCheck}
            value={email}
            placeholder="이메일 주소(필수)"
            message={
              email
                ? emailLoading
                  ? '중복체크 중입니다.'
                  : emailError
                  ? emailError
                  : '사용 가능한 이메일입니다.'
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
            onPress={() => goBack()}
            style={styles.button}
            outline
            styleTitle={{color: colors.border}}>
            취소
          </ButtonWrap>
          <ButtonWrap
            disabled={buttonDisabled}
            onPress={signUp}
            style={styles.button}
            styleTitle={styles.buttonTitle}
            disabledBackgroundColor={
              !buttonDisabled && styles.buttonBackground
            }>
            다음
          </ButtonWrap>
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  forms: {
    marginHorizontal: 16,
  },
  input: {
    marginTop: 20,
  },
  root: {flex: 1},
  title: {
    marginHorizontal: 16,
    fontSize: 22,
    marginTop: 20,
    lineHeight: 26,
    color: '#222',
  },
  subTitle: {
    backgroundColor: colors.border,
    marginHorizontal: 16,
    paddingVertical: 12,
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
    lineHeight: 22,
    marginTop: 10,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    paddingHorizontal: 16,
    lineHeight: 20,
    color: '#222',
  },
  buttonWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '40%',
    marginTop: 10,
  },
  buttonTitle: {
    color: colors.white,
  },
  buttonBackground: {
    backgroundColor: colors.prussianBlue,
  },
  clock: {width: 15, height: 15, marginRight: 2},
  footer3: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  footer3T1: {
    lineHeight: 15,
    fontSize: 12,
    color: '#777777',
  },
  footerWrap: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  arrowHalfRight: {
    resizeMode: 'contain',
    width: 10,
    height: 4.2,
    marginLeft: 4,
  },
  footer: {
    color: '#999999',
    lineHeight: 18,
    marginTop: 40,
    fontSize: 12,
  },
  footer2: {
    color: '#999999',
    lineHeight: 18,
    fontSize: 12,
  },
  footerBold: {
    fontSize: 12,
    lineHeight: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    color: '#222222',
  },
});
