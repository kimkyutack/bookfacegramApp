import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Image, Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputPhone from '../../components/input-phone/InputPhone';
import InputWrap from '../../components/input-wrap/InputWrap';
import TextWrap from '../../components/text-wrap/TextWrap';
import TextButton from '../../components/text-button/TextButton';
import RootLayout from '../../layouts/root-layout/RootLayout';
import {navigate, reset} from '../../services/navigation';
import {dialogOpenMessage, dialogError} from '../../redux/dialog/DialogActions';
import {requestPost} from '../../services/network';
import {getItem, setItem} from '../../services/preference';
import {userCheckToken, userSignOut} from '../../redux/user/UserActions';
import {requestGet} from '../../services/network';
import consts from '../../libs/consts';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import fonts from '../../libs/fonts';
import {
  containPasswordCheck,
  preventKor,
  widthPercentage,
  heightPercentage,
  fontPercentage,
  screenWidth,
} from '../../services/util';
export default function FindPw({navigation}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //console.log(JSON.stringify(user));
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setUsername('');

      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigate]);

  const buttonDisabled = !email || !username;

  const handleFindId = () => {
    requestGet({
      url: consts.apiUrl + '/auth/findMember/password',
      query: {
        korNm: username,
        email: email,
      },
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          navigate(routes.passwordUpdate, {
            memberIdx: res.data.memberIdx,
          });
        } else if (res.status === 'FAIL') {
          dispatch(
            dialogError(
              '입력하신 이름과 이메일에 해당하는 회원정보를 찾지못했습니다. 다시 입력해주세요.',
            ),
          );
        } else {
          dispatch(
            dialogError(
              '입력하신 이름과 이메일에 해당하는 회원정보를 찾지못했습니다. 다시 입력해주세요.',
            ),
          );
        }
      })
      .catch(error => {
        dispatch(
          dialogError(
            '입력하신 이름과 이메일에 해당하는 회원정보를 찾지못했습니다. 다시 입력해주세요.',
          ),
        );
      });
  };

  const handleRegister = () => {
    navigate(routes.registerForm);
  };

  return (
    <RootLayout
      topbar={{
        title: '비밀번호 찾기',
        back: true,
      }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.root}>
        <TextWrap style={styles.subTitle}>
          가입 시 입력한 정보로 새 비밀번호를를 설정 할 수 있습니다.
        </TextWrap>
        <InputWrap
          // icon={image.idIcon}
          style={styles.input}
          inputStyle={styles.inputValue}
          placeholder="이름(필수)"
          placeholderTextColor="#acacac"
          value={username}
          // borderColor={Boolean(passwordError) && colors.red}
          onChange={setUsername}
          maxLength={50}
        />
        <InputWrap
          // icon={image.pwIcon}
          style={styles.input2}
          inputStyle={styles.inputValue}
          placeholder="이메일 주소(필수)"
          placeholderTextColor="#acacac"
          value={email}
          onChange={setEmail}
        />
        <View style={styles.row}>
          <ButtonWrap
            disabled={buttonDisabled}
            onPress={handleFindId}
            style={buttonDisabled ? styles.diabledButton : styles.button}
            styleTitle={styles.buttonTitle}
            disabledBackgroundColor={
              !buttonDisabled && styles.buttonBackground
            }>
            찾기
          </ButtonWrap>
        </View>
        <View style={styles.row1}>
          <TextButton
            onPress={() => {
              navigate(routes.findId);
            }}
            //onPress={handleFindIdPassword}
            styleTitle={styles.t}
            font={fonts.kopubWorldDotumProMedium}>
            아이디 찾기
          </TextButton>
          <TextWrap style={styles.t2}>|</TextWrap>
          <TextButton
            onPress={handleRegister}
            styleTitle={styles.t}
            font={fonts.kopubWorldDotumProMedium}>
            회원가입
          </TextButton>
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 40,
  },
  input2: {
    marginTop: 30,
  },
  root: {
    paddingHorizontal: 16,
    paddingVertical: 20,
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
    paddingVertical: 20,
    textAlign: 'center',
    color: '#333333',
    fontSize: fontPercentage(10),
    lineHeight: fontPercentage(14),
    marginTop: 10,
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: widthPercentage(180),
    height: heightPercentage(43),
    marginTop: 30,
  },
  diabledButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: widthPercentage(180),
    height: heightPercentage(43),
    marginTop: 30,
    backgroundColor: '#c9c9c9',
  },
  buttonTitle: {
    backgroundColor: 'transparent',
    color: colors.white,
  },
  buttonBackground: {
    backgroundColor: colors.prussianBlue,
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
  //row: {flexDirection: 'row'},
  row1: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 15,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  t: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#666',
    display: 'flex',
    marginTop: 9,
    alignSelf: 'center',
    textAlign: 'center',
  },
  t2: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#666',
    marginTop: 10,
    display: 'flex',
    paddingHorizontal: 5,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
