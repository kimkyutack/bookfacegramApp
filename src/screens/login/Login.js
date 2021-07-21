import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  View,
  PixelRatio,
  Dimensions,
  Text,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputWrap from '../../components/input-wrap/InputWrap';
import TextButton from '../../components/text-button/TextButton';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import image from '../../libs/image';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import {convertKorPhoneFormat, getAgeFromMoment} from '../../services/util';
import {
  dialogError,
  dialogOpenMessage,
  dialogOpenAction,
} from '../../redux/dialog/DialogActions';
import {userCheckToken, userSignOut} from '../../redux/user/UserActions';
import {navigationRef, reset, navigate} from '../../services/navigation';
import {requestPost} from '../../services/network';
import {getItem, setItem} from '../../services/preference';
import {screenWidth, validationEmail} from '../../services/util';
import Avatar from '../../components/avatar/Avatar';

import {
  getProfile as getKakaoProfile,
  login,
} from '@react-native-seoul/kakao-login';

export default function Login({route}) {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((username || password) && passwordError) {
      setPasswordError('');
    }
  }, [username, password]);

  useEffect(() => {
    if (user.signed) {
      if (user.intro_setting) {
        reset(routes.home);
      } else {
        navigate(routes.intro1);
      }
    }
  }, [user.signed]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      Keyboard.dismiss();
      const token = await requestPost({
        url: consts.apiUrl + '/makeJwt',
        body: {
          member_id: username,
          password: password,
          platform_type: 'app',
        },
      });
      if (token.valid) {
        await setItem('token', token.token);
        await setItem('platformType', 'app');
        dispatch(userCheckToken);
      } else {
        setPasswordError('가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.');
      }
    } catch (error) {
      if (error.message === 'Network Error') {
        dispatch(dialogError(error));
      } else {
        setPasswordError('가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.');
      }
    }
    setLoading(false);
  };

  const handleRegister = () => {
    navigate(routes.registerForm);
  };

  const handleFindIdPassword = () => {
    // navigate(routes.findIdPassword);
  };

  const signInWithToaping = () => {
    navigate(routes.toapingLogin);
  };

  const signInWithKakao = async () => {
    try {
      const token = await login();
      const profile = await getKakaoProfile();
      await setItem('token', JSON.stringify(token.accessToken));
      await setItem('platformType', 'kakao');

      const platformType = await getItem('platformType');
      const result = await requestPost({
        url: consts.apiUrl + '/memberSnsJoin',
        body: {
          member_id: profile.email,
          platform_type: platformType,
          sex: profile.gender === 'MALE' ? '남' : '여',
          handphone:
            profile.phoneNumber === 'null'
              ? ''
              : convertKorPhoneFormat(profile.phoneNumber),
          birth_day: profile.birthday,
          birth_year: profile.birthyear,
          age: getAgeFromMoment(
            profile.birthyear + profile.birthDay,
            'YYYYMMDD',
          ),
          kor_nm: profile.nickname,
          email: profile.email,
        },
      });
      if (result.valid) {
        dispatch(userCheckToken);
      } else {
        // 타입 이 중복일때는 로그인시키고 찐 에러일때는 에러메시지 보내야함 백에서의 리턴이필요
        // dispatch(dialogError({message: result.msg}));
        dispatch(userCheckToken);
      }
    } catch (e) {
      // dispatch(dialogError(e));
    }
  };

  return (
    <RootLayout style={styles.root}>
      <Image source={image.login} style={styles.logo} />
      <InputWrap
        // icon={image.idIcon}
        style={styles.input}
        placeholder="아이디"
        value={username}
        // borderColor={Boolean(passwordError) && colors.red}
        onChange={setUsername}
        maxLength={50}
      />
      <InputWrap
        // icon={image.pwIcon}
        style={styles.input2}
        placeholder="비밀번호"
        secure
        value={password}
        onChange={setPassword}
        maxLength={20}
        // borderColor={Boolean(passwordError) && colors.red}
        message={passwordError}
        messageColor={colors.red}
      />

      <View style={styles.row}>
        <ButtonWrap
          loading={loading}
          onPress={handleLogin}
          disabled={!password || !username || passwordError}
          style={styles.button}
          styleTitle={styles.buttonTitle}>
          로그인
        </ButtonWrap>
      </View>
      <View style={styles.row}>
        <TextButton
          // onPress={() => {
          //   navigate(routes.registerPhoneVerify);
          // }}
          onPress={handleFindIdPassword}
          styleTitle={styles.t}
          font={fonts.notoSansCjkKrRegular}>
          아이디 찾기
        </TextButton>
        <TextWrap style={styles.t2}>|</TextWrap>
        <TextButton
          // onPress={() => {
          //   navigate(routes.registerPhoneVerify);
          // }}
          onPress={handleFindIdPassword}
          styleTitle={styles.t}
          font={fonts.notoSansCjkKrRegular}>
          비밀번호 찾기
        </TextButton>
        <TextWrap style={styles.t2}>|</TextWrap>
        <TextButton
          onPress={handleRegister}
          styleTitle={styles.t}
          font={fonts.notoSansCjkKrRegular}>
          회원가입
        </TextButton>
      </View>

      <View style={styles.rowCenter}>
        <TextButton
          onPress={() => {
            // navigate(routes.findIdPassword);
          }}
          disabled
          styleTitle={styles.text}
          font={fonts.notoSansCjkKrRegular}>
          간편 로그인
        </TextButton>
      </View>

      <View
        // disabled={!onItemPress}
        // onPress={onItemPress}
        style={styles.rowAround}>
        <View>
          <Avatar source={image.toaping} onPress={signInWithToaping} />
          <TextWrap
            font={fonts.notoSansCjkKrRegular}
            style={styles.avatarToapingTitle}>
            토핑
          </TextWrap>
        </View>
        <View>
          <Avatar source={image.kakao} onPress={signInWithKakao} />
          <TextWrap
            font={fonts.notoSansCjkKrRegular}
            style={styles.avatarKakaoTitle}>
            카카오톡
          </TextWrap>
        </View>
        <View>
          <Avatar source={image.facebook} />
          <TextWrap
            font={fonts.notoSansCjkKrRegular}
            style={styles.avatarFacebookTitle}>
            페이스북
          </TextWrap>
        </View>
        <View>
          <Avatar source={image.naver} />
          <TextWrap
            font={fonts.notoSansCjkKrRegular}
            style={styles.avatarNaverTitle}>
            네이버
          </TextWrap>
        </View>

        <View>
          <Avatar source={image.google} />
          <TextWrap
            font={fonts.notoSansCjkKrRegular}
            style={styles.avatarGoogleTitle}>
            구글
          </TextWrap>
        </View>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  paragraph: {
    fontSize: 20,
  },
  row: {flexDirection: 'row', marginTop: 10},
  rowCenter: {flexDirection: 'row', justifyContent: 'center'},
  rowAround: {
    flexDirection: 'row',
    marginTop: 18,
    width: '80%',
    justifyContent: 'space-between',
  },
  t: {
    fontSize: 12,
    fontFamily: fonts.notoSansCjkKrRegular,
    color: '#ffffff',
    marginTop: 10,
    paddingLeft: 10,
  },
  t2: {
    fontSize: 13,
    fontFamily: fonts.notoSansCjkKrRegular,
    color: '#ffffff',
    marginTop: 7,
    paddingLeft: 10,
  },
  text: {
    marginTop: 71,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: fonts.notoSansCjkKrRegular,
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  t1: {
    borderRightWidth: 1,
    borderColor: '#777777',
  },
  input: {
    marginTop: 40,
  },
  input2: {
    marginTop: 30,
  },
  logo: {
    // width: screenWidth / 1.5,
    resizeMode: 'contain',
  },
  button: {
    justifyContent: 'center',
    width: '80%',
    marginTop: 30,
  },
  buttonTitle: {
    color: '#000000',
  },
  button2: {
    marginTop: 10,
  },
  avatarFacebookTitle: {
    fontSize: 12,
    alignSelf: 'center',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  avatarKakaoTitle: {
    fontSize: 12,
    alignSelf: 'center',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  avatarNaverTitle: {
    fontSize: 12,
    alignSelf: 'center',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  avatarToapingTitle: {
    fontSize: 12,
    alignSelf: 'center',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  avatarGoogleTitle: {
    fontSize: 12,
    alignSelf: 'center',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
});
