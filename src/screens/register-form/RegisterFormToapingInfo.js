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

export default function RegisterFormToapingInfo({}) {
  const scrollRef = useRef();
  const {params} = useRoute();
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [name, setName] = useState(
    params?.data?.name ? params?.data?.name : '',
  );
  const [memberId, setMemberId] = useState(
    params?.userId ? params?.userId : '',
  );
  const [password, setPassword] = useState(
    params?.password ? params?.password : '',
  );
  const [passwordConfirm, setPasswordConfirm] = useState(
    params?.password ? params?.password : '',
  );
  const [category, setCategory] = useState(
    params?.category ? params?.category : '',
  );
  const [phone, setPhone] = useState(
    params?.data?.handphone ? params?.data?.handphone : '',
  );
  const [email, setEmail] = useState(
    params?.data?.email ? params?.data?.email : '',
  );
  const [level, setLevel] = useState(
    params?.data?.level ? params?.data?.level : 0,
  );
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (user.signed) {
      if (user.intro_setting) {
        reset(routes.home);
      } else {
        if(category !== 'partner'){
          navigate(routes.intro1, {age: user.age, initGrade: level !== 0 ? level : user.grade});
        }else{
          navigate(routes.intro2, {grade: 10, category: category});
        }
      }
    }
  }, [user.signed]);

  const signUp = async () => {
    Keyboard.dismiss();
    // ?????? ????????? ?????? ????????? ???????????? ????????? ????????? ???????????? ??????????????????

    try {
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/auth/validEmail',
        query: {
          email: email,
        },
      });
      if (status === 'SUCCESS') {
        setEmailError('');
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
        url: consts.apiUrl + '/auth/toapingMemberJoin',
        body: {
          memberId: memberId,
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
        await setItem('platformType', 'toaping');
        if(category !== 'partner'){
          await setItem('level', '' + level);
        }else{
          await setItem('level', '10');
        }
        await setItem('toapingId', memberId);
        await setItem('toapingPw', password);
        await setItem('category', category);

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
    Boolean(emailError);

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
            value={memberId}
            placeholder="?????????(??????)"
            placeholderTextColor="#acacac"
            maxLength={20}
            disabled
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
            disabled
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
            disabled
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
