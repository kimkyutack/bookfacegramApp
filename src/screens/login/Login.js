import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  View,
  PixelRatio,
  Dimensions,
  Text,
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
import {dialogError, dialogOpenMessage} from '../../redux/dialog/DialogActions';
import {userCheckToken} from '../../redux/user/UserActions';
import {navigate, reset} from '../../services/navigation';
import {requestPost} from '../../services/network';
import {getItem, setItem} from '../../services/preference';
import {screenWidth, validationEmail} from '../../services/util';
import Avatar from '../../components/avatar/Avatar';

export default function Login({}) {
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

  // useEffect(() => {
  //   getItem('email').then(x => {
  //     if (x && validationEmail(x)) {
  //       setUsername(x);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (user.signed) {
      reset(routes.home);
    }
  }, [user.signed]);

  const handleLogin = async () => {
    // setLoading(true);
    navigate(routes.home);

    // try {
    //   if (
    //     !validationEmail(username) ||
    //     password.length < 8 ||
    //     password.length > 20
    //   ) {
    //     throw '';
    //   }
    //   Keyboard.dismiss();
    //   const {token} = await requestPost({
    //     url: consts.apiUrl + '/users/signin',
    //     body: {
    //       email: username,
    //       password,
    //     },
    //   });

    //   await setItem('pushApp', 'true');
    //   await setItem('token', token);
    //   // dispatch(userCheckToken);
    //   await setItem('email', username);
    // } catch (error) {
    //   if (error.message === 'Network Error') {
    //     dispatch(dialogError(error));
    //   } else {
    //     setPasswordError(
    //       'The information does not match.\nPlease check your ID or password.',
    //     );
    //   }
    // }
    // setLoading(false);
  };

  const handleRegister = () => {
    // navigate(routes.registerPhoneVerify);
  };

  const handleFindIdPassword = () => {
    // navigate(routes.findIdPassword);
  };

  const onGoogleButtonPress = async () => {
    console.log('google sign');
  };

  return (
    <RootLayout style={styles.root}>
      <Image source={image.login} style={styles.logo} />
      <InputWrap
        // icon={image.idIcon}
        style={styles.input}
        placeholder="아이디"
        value={username}
        borderColor={Boolean(passwordError) && colors.red}
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
        borderColor={Boolean(passwordError) && colors.red}
        message={passwordError}
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
          // onPress={() => {
          //   navigate(routes.registerPhoneVerify);
          // }}
          onPress={handleFindIdPassword}
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
          <Avatar source={image.toaping} />
          <TextWrap
            font={fonts.notoSansCjkKrRegular}
            style={styles.avatarToapingTitle}>
            토핑
          </TextWrap>
        </View>
        <View>
          <Avatar source={image.kakao} />
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
          <Avatar source={image.google} onPress={onGoogleButtonPress} />
          <TextWrap
            class="g-signin2"
            data-onsuccess="onSignIn"
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
