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
import images from '../../libs/images';
import fonts from '../../libs/fonts';
import routes from '../../libs/routes';
import {
  convertKorPhoneFormat,
  getAgeFromMoment,
  widthPercentage,
  heightPercentage,
  fontPercentage,
} from '../../services/util';
import {
  dialogError,
  dialogOpenMessage,
  dialogOpenAction,
  dialogOpenSelect,
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
  loginWithKakaoAccount,
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
        navigate(routes.intro1, {age: user.age});
      }
    }
  }, [user.signed]);

  const handleLogin = async type => {
    setLoading(true);
    try {
      Keyboard.dismiss();
      let userId = '';
      let userPw = '';
      if (type === 'app') {
        userId = username;
        userPw = password;
      } else if (type === 'toaping') {
        userId = await getItem('toapingId');
        userPw = await getItem('toapingPw');
        if (!userId || !userPw) {
          throw 'toapingError';
        }
      }
      const {data, status} = await requestPost({
        url: consts.apiUrl + '/auth/login',
        body: {
          memberId: userId,
          password: userPw,
          platformType: type,
        },
      });
      if (status === 'SUCCESS') {
        await setItem('accessToken', data.accessToken);
        await setItem('refreshToken', data.refreshToken);
        await setItem('platformType', type);
        dispatch(userCheckToken);
      } else if (status === 'FAIL') {
        setPasswordError('가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.');
      }
    } catch (error) {
      if (error === 'toapingError') {
        setLoading(false);
        navigate(routes.toapingLogin);
      } else {
        setPasswordError('가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.');
        // dispatch(
        //   dialogOpenMessage({
        //     message:
        //       error?.data?.msg ||
        //       (typeof error === 'object' ? JSON.stringify(error) : error),
        //   }),
        // );
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
    dispatch(
      dialogOpenSelect({
        item: [
          {
            name: '토핑계정으로 간편로그인',
            source: images.toapingIcon,
            type: 'login',
            onPress: () => signInWithToapingType(),
          },
          {
            name: '다른 토핑계정으로 로그인',
            source: images.toapingIcon,
            type: 'login',
            onPress: () => navigate(routes.toapingLogin),
          },
        ],
      }),
    );
  };

  const signInWithToapingType = async () => {
    try {
      handleLogin('toaping');
    } catch (e) {
      dispatch(dialogError(e));
    }
  };

  const signInWithKakao = async () => {
    dispatch(
      dialogOpenSelect({
        item: [
          {
            name: '카카오톡으로 간편로그인',
            source: images.kakaoIcon,
            type: 'login',
            onPress: () => signInWithKakaoType('exist'),
          },
          {
            name: '다른 카카오계정으로 로그인',
            source: images.kakaoIcon,
            type: 'login',
            onPress: () => signInWithKakaoType('change'),
          },
        ],
      }),
    );
  };

  const signInWithKakaoType = async type => {
    try {
      let token = '';
      if (type === 'exist') {
        token = await login();
      } else if (type === 'change') {
        token = await loginWithKakaoAccount('change');
      }
      const {data, status} = await requestPost({
        url: consts.apiUrl + '/auth/snsLogin',
        body: {
          platformType: 'kakao',
          snsToken: token.accessToken,
        },
      });
      if (status === 'SUCCESS') {
        await setItem('accessToken', data.accessToken);
        await setItem('refreshToken', data.refreshToken);
        await setItem('platformType', 'kakao');
        dispatch(userCheckToken);
      } else {
        // fail
        setPasswordError('카카오 로그인 에러');
      }
    } catch (e) {
      dispatch(dialogError(e));
    }
  };

  return (
    <RootLayout style={styles.root}>
      <View style={styles.inputRow}>
        <Image source={images.login} style={styles.logo} />
        <InputWrap
          // icon={image.idIcon}
          style={styles.input}
          placeholder="아이디"
          value={username}
          selectionColor={colors.white}
          onChange={setUsername}
          maxLength={50}
        />
        <InputWrap
          // icon={image.pwIcon}
          style={styles.input2}
          placeholder="비밀번호"
          selectionColor={colors.white}
          secure
          value={password}
          onChange={setPassword}
          maxLength={20}
          message={passwordError}
          messageColor={colors.red}
        />
      </View>

      <View style={styles.row}>
        <ButtonWrap
          loading={loading}
          onPress={() => handleLogin('app')}
          disabled={!password || !username || passwordError}
          style={styles.button}
          styleTitle={styles.buttonTitle}>
          로그인
        </ButtonWrap>
      </View>
      <View style={styles.row1}>
        <TextButton
          // onPress={() => {
          //   navigate(routes.registerPhoneVerify);
          // }}
          onPress={handleFindIdPassword}
          styleTitle={styles.t}
          font={fonts.kopubWorldDotumProMedium}>
          아이디 찾기
        </TextButton>
        <TextWrap style={styles.t2}>|</TextWrap>
        <TextButton
          // onPress={() => {
          //   navigate(routes.registerPhoneVerify);
          // }}
          onPress={handleFindIdPassword}
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

      <View style={styles.rowCenter}>
        <TextButton
          onPress={() => {
            // navigate(routes.findIdPassword);
          }}
          disabled
          styleTitle={styles.text}
          font={fonts.kopubWorldDotumProMedium}>
          간편 로그인
        </TextButton>
      </View>

      <View style={styles.rowAround}>
        <View>
          <Avatar
            style={styles.avator}
            source={images.toapingIcon}
            onPress={signInWithToaping}
          />
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.avatarTitle}>
            토핑
          </TextWrap>
        </View>
        <View>
          <Avatar
            style={styles.avator}
            source={images.kakaoIcon}
            onPress={signInWithKakao}
          />
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.avatarTitle}>
            카카오톡
          </TextWrap>
        </View>
        <View>
          <Avatar style={styles.avator} source={images.naverIcon} />
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.avatarTitle}>
            네이버
          </TextWrap>
        </View>
        <View>
          <Avatar style={styles.avator} source={images.facebookIcon} />
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.avatarTitle}>
            페이스북
          </TextWrap>
        </View>
        <View>
          <Avatar style={styles.avator} source={images.googleIcon} />
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.avatarTitle}>
            구글
          </TextWrap>
        </View>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  inputRow: {
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: widthPercentage(40),
  },
  row: {flexDirection: 'row'},
  row1: {
    flexDirection: 'row',
    marginTop: heightPercentage(37.4),
  },
  rowCenter: {
    flexDirection: 'row',
    marginTop: heightPercentage(71),
  },
  rowAround: {
    marginTop: heightPercentage(23),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: widthPercentage(70),
    justifyContent: 'space-around',
  },
  t: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#ffffff',
    marginTop: 9,
  },
  t2: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#ffffff',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  text: {
    fontSize: fontPercentage(11),
    lineHeight: fontPercentage(17),
    fontFamily: fonts.kopubWorldDotumProMedium,
    color: '#ffffff',
    borderBottomWidth: 0.2,
    textAlign: 'center',
    borderBottomColor: colors.white,
  },
  input: {
    marginTop: heightPercentage(33.5),
  },
  input2: {
    marginTop: heightPercentage(26),
  },
  logo: {
    width: widthPercentage(161),
    height: heightPercentage(68.5),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  button: {
    justifyContent: 'center',
    width: widthPercentage(250),
    height: heightPercentage(42.6),
    marginTop: heightPercentage(37.5),
  },
  buttonTitle: {
    color: '#000000',
    fontSize: fontPercentage(15),
    lineHeight: fontPercentage(23),
  },
  avator: {
    width: widthPercentage(32),
    height: heightPercentage(32),
  },
  avatarTitle: {
    fontSize: fontPercentage(8),
    lineHeight: fontPercentage(12),
    alignSelf: 'center',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginTop: 5,
  },
});
