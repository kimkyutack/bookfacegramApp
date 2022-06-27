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
export default function FindIdOk({route, navigation}) {
  const scrollRef = useRef();
  const {params} = useRoute();
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
  const handleRegister = () => {
    navigate(routes.registerForm);
  };
  const handleLogin = () => {
    navigate(routes.login);
  };

  const handleFindPassword = () => {
    navigate(routes.findPw);
  };

  return (
    <RootLayout
      topbar={{
        title: '아이디 찾기',
        back: true,
      }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.root}>
        <TextWrap style={styles.subTitle}>
          회원님의 아이디는 다음과 같습니다.
        </TextWrap>
        <TextWrap style={styles.subTitle2}>{params.memberId}</TextWrap>
        <TextWrap style={styles.subTitle}>
          개인 정보 보호를 위해 앞의 두 글자만 보여드립니다.{'\n'}전체 아이디는
          입력하신 이메일 주소로 보내드렸습니다.
        </TextWrap>
        <View style={styles.row}>
          <ButtonWrap
            onPress={handleLogin}
            style={styles.button}
            styleTitle={styles.buttonTitle}>
            확인
          </ButtonWrap>
        </View>
        <View style={styles.row1}>
          <TextButton
            // onPress={() => {
            //   navigate(routes.registerPhoneVerify);
            // }}
            onPress={handleFindPassword}
            styleTitle={styles.t}
            font={fonts.kopubWorldDotumProMedium}>
            비밀번호 찾기
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
    paddingVertical: 30,
  },
  title: {
    marginHorizontal: 16,
    fontSize: 22,
    marginTop: 20,
    lineHeight: 26,
    color: '#222',
  },
  subTitle: {
    paddingVertical: 10,
    textAlign: 'center',
    color: '#333333',
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(14),
    marginTop: 10,
  },
  subTitle2: {
    textAlign: 'center',
    color: '#0066ff',
    fontSize: fontPercentage(13.5),
    lineHeight: fontPercentage(15),
    marginTop: 10,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.prussianBlue,
    justifyContent: 'center',
    width: widthPercentage(180),
    height: heightPercentage(43),
    marginTop: 30,
  },
  diabledButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: widthPercentage(130),
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
