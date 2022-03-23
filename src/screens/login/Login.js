import React, {useEffect, useState, useRef} from 'react';
import {Image, Keyboard, StyleSheet, View, Platform} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
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
  dialogOpenKakaoLoginSelect,
  dialogClose,
} from '../../redux/dialog/DialogActions';
import {userCheckToken, userSignOut} from '../../redux/user/UserActions';
import {navigationRef, reset, navigate} from '../../services/navigation';
import {requestGet, requestPost} from '../../services/network';
import {getItem, setItem} from '../../services/preference';
import Avatar from '../../components/avatar/Avatar';

import {
  getProfile as getKakaoProfile,
  login as kakaoLogin,
  unlink,
  loginWithKakaoAccount,
} from '@react-native-seoul/kakao-login';
import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, Profile} from 'react-native-fbsdk-next';

export default function Login({route}) {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user, shallowEqual);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const [facebookAccessToken, setFacebookAccessToken] = useState('');

  const naverIosKeys = {
    kConsumerKey: Config.NAVER_CLIENT_ID,
    kConsumerSecret: Config.NAVER_CLIENT_SECRET,
    kServiceAppName: Config.NAVER_CLIENT_NAME,
    kServiceAppUrlScheme: Config.NAVER_CLINET_SCHEME, // only for iOS
  };
  const naverAndroidKeys = {
    kConsumerKey: Config.NAVER_CLIENT_ID,
    kConsumerSecret: Config.NAVER_CLIENT_SECRET,
    kServiceAppName: Config.NAVER_CLIENT_NAME,
  };
  const naverInitials = Platform.OS === 'ios' ? naverIosKeys : naverAndroidKeys;

  useEffect(() => {
    if ((username || password) && passwordError) {
      setPasswordError('');
    }
  }, [username, password]);

  useEffect(() => {
    signInWithGoogleConfigure();
    return () => {
      setLoading(false);
      setPasswordError('');
      setUsername('');
      setPassword('');
    };
  }, []);

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
        if (data?.lnupMember) {
          navigate(routes.registerForm, {
            data: data?.lnupMember,
            userId: userId,
            password: userPw,
            platformType: type,
          });
        } else {
          await setItem('accessToken', data.accessToken);
          await setItem('refreshToken', data.refreshToken);
          await setItem('platformType', type);
          dispatch(userCheckToken);
        }
      } else if (status === 'FAIL') {
        setPasswordError('가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.');
      }
    } catch (error) {
      if (error === 'toapingError') {
        setLoading(false);
        navigate(routes.toapingLogin);
      } else {
        if (type === 'app') {
          setPasswordError(
            '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.22',
          );
        } else {
          dispatch(
            dialogOpenMessage({
              message:
                error?.data?.msg ||
                error?.message ||
                (typeof error === 'object' ? JSON.stringify(error) : error),
            }),
          );
          setLoading(false);
          navigate(routes.toapingLogin);
        }
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

  const signInWithApp = async () => {
    try {
      handleLogin('app');
    } catch (e) {
      dispatch(dialogError(e));
    }
  };

  const signInWithToaping = () => {
    try {
      handleLogin('toaping');
    } catch (e) {
      dispatch(dialogError(e));
    }
    // 다른 계정 로그인 팝업 선택
    // dispatch(
    //   dialogOpenSelect({
    //     item: [
    //       {
    //         name: '토핑계정으로 간편로그인',
    //         source: images.toapingIcon,
    //         type: 'login',
    //         onPress: () => signInWithToapingSelect(),
    //       },
    //       {
    //         name: '다른 토핑계정으로 로그인',
    //         source: images.toapingIcon,
    //         type: 'login',
    //         onPress: () => navigate(routes.toapingLogin),
    //       },
    //     ],
    //   }),
    // );
  };

  const signInWithToapingSelect = async () => {
    try {
      handleLogin('toaping');
    } catch (e) {
      dispatch(dialogError(e));
    }
  };

  const signInWithKakao = async () => {
    // await unlink();
    dispatch(
      dialogOpenKakaoLoginSelect({
        item: [
          {
            // name: '카카오톡으로 간편로그인',
            source: images.kakaoLogin,
            type: 'login',
            onPress: () => signInWithKakaoSelect('exist'),
          },
          {
            // name: '다른 카카오계정으로 로그인',
            source: images.kakaoLoginAuth,
            type: 'login',
            onPress: async () => {
              await signInWithKakaoSelect('change');
            },
          },
          {
            // name: 'close'
            source: images.kakaoLoginClose,
            type: 'close',
            onPress: () => dispatch(dialogClose()),
          },
        ],
      }),
    );
  };

  const signInWithKakaoSelect = async type => {
    try {
      let token = '';
      if (type === 'exist') {
        token = await kakaoLogin();
      } else if (type === 'change') {
        token = await loginWithKakaoAccount();
      }

      const profile = await getKakaoProfile();
      let serviceTerms = {};
      try {
        serviceTerms = await requestGet({
          url: 'https://kapi.kakao.com/v1/user/service/terms',
          // query: {extra: 'app_service_terms'},
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
      } catch (e) {
        throw 'get kakao serviceTerms error';
      }

      const {data, status} = await requestPost({
        url: consts.apiUrl + '/auth/kakaoLogin',
        body: {
          platformType: 'kakao',
          memberId: profile.email ? profile.email : '',
          sex:
            profile.gender === 'null'
              ? ''
              : profile.gender === 'MALE'
              ? '남'
              : '여',
          handphone:
            profile.phoneNumber === 'null'
              ? ''
              : convertKorPhoneFormat(profile.phoneNumber),
          birth_day:
            profile?.birthday === 'null'
              ? ''
              : profile?.birthday.length === 4
              ? profile.birthday
              : '0' + profile.birthday,
          birth_year: profile.birthyear === 'null' ? '' : profile.birthyear,
          age:
            profile.birthyear === 'null'
              ? ''
              : getAgeFromMoment(
                  profile.birthyear + profile.birthDay,
                  'YYYYMMDD',
                ),
          kor_nm: profile.nickname,
          email: profile.email,
          profile_path: profile.thumbnailImageUrl,
          agree_sms: serviceTerms?.allowed_service_terms
            ? serviceTerms?.allowed_service_terms
                ?.map(x => x.tag)
                .indexOf('agree_sms') !== -1
              ? 1
              : 0
            : 0,
          agree_email: serviceTerms?.allowed_service_terms
            ? serviceTerms?.allowed_service_terms
                ?.map(x => x.tag)
                .indexOf('agree_email') !== -1
              ? 1
              : 0
            : 0,
          agree_app_push: serviceTerms?.allowed_service_terms
            ? serviceTerms?.allowed_service_terms
                ?.map(x => x.tag)
                .indexOf('agree_app_push') !== -1
              ? 1
              : 0
            : 0,
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

  const signInWithNaver = () => {
    NaverLogin.login(naverInitials, async (err, naverToken) => {
      if (err) {
        dispatch(dialogError(err));
      } else {
        const profileResult = await getProfile(naverToken.accessToken);
        if (profileResult.resultcode === '024') {
          dispatch(dialogError('로그인 실패' + profileResult.message));
          return;
        }
        const {data, status} = await requestPost({
          url: consts.apiUrl + '/auth/naverLogin',
          body: {
            platformType: 'naver',
            memberId: profileResult.response?.email,
            email: profileResult.response?.email,
            handphone: profileResult.response?.mobile?.replace(/-/g, ''),
            kor_nm: profileResult.response?.name,
            profile_path: profileResult.response?.profile_image,
          },
        });
        if (status === 'SUCCESS') {
          await setItem('accessToken', data.accessToken);
          await setItem('refreshToken', data.refreshToken);
          await setItem('platformType', 'naver');
          dispatch(userCheckToken);
        } else {
          // fail
          setPasswordError('네이버 로그인 에러');
        }
      }
    });
  };

  const signInWithGoogleConfigure = () => {
    try {
      GoogleSignin.configure({
        scopes: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/user.phonenumbers.read',
        ],
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
      });
    } catch (e) {
      dispatch(dialogError('구글설정오류'));
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {accessToken} = await GoogleSignin.getTokens();
      await axios({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        url: `https://people.googleapis.com/v1/people/${userInfo.user.id}?personFields=phoneNumbers`,
      })
        .then(async function (response) {
          if (response.data.phoneNumbers) {
            const {data, status} = await requestPost({
              url: consts.apiUrl + '/auth/googleLogin',
              body: {
                platformType: 'google',
                memberId: userInfo.user.email,
                email: userInfo.user.email,
                handphone: '0' + response.data?.phoneNumbers[0]?.value,
                kor_nm: userInfo.user.name,
                profile_path: userInfo.user.photo,
              },
            });
            if (status === 'SUCCESS') {
              await setItem('accessToken', data.accessToken);
              await setItem('refreshToken', data.refreshToken);
              await setItem('platformType', 'google');
              dispatch(userCheckToken);
            } else {
              setPasswordError('구글 로그인 에러');
            }
          } else {
            const {data, status} = await requestPost({
              url: consts.apiUrl + '/auth/googleLogin',
              body: {
                platformType: 'google',
                memberId: userInfo.user.email,
                email: userInfo.user.email,
                kor_nm: userInfo.user.name,
                profile_path: userInfo.user.photo,
              },
            });
            if (status === 'SUCCESS') {
              await setItem('accessToken', data.accessToken);
              await setItem('refreshToken', data.refreshToken);
              await setItem('platformType', 'google');
              dispatch(userCheckToken);
            } else {
              setPasswordError('구글 로그인 에러');
            }
          }
        })
        .catch(function (error) {
          dispatch(dialogError(error));
        });
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  const signWithFacebook = async () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      async function (result) {
        if (result.isCancelled) {
          dispatch(dialogError('Login cancelled'));
        } else {
          const profile = await Profile.getCurrentProfile();
          if (profile === null) {
            signWithFacebook();
          } else {
            try {
              const {data, status} = await requestPost({
                url: consts.apiUrl + '/auth/facebookLogin',
                body: {
                  platformType: 'facebook',
                  memberId: profile.userID,
                  email: profile.email,
                  kor_nm: profile.name,
                  profile_path: profile.imageURL,
                },
              });
              if (status === 'SUCCESS') {
                await setItem('accessToken', data.accessToken);
                await setItem('refreshToken', data.refreshToken);
                await setItem('platformType', 'facebook');
                dispatch(userCheckToken);
              } else {
                setPasswordError('구글 로그인 에러');
              }
            } catch (e) {
              // console.log(e);
            }
          }
        }
      },
      function (error) {
        dispatch(dialogError(error));
      },
    );
  };

  return (
    <RootLayout style={styles.root}>
      <View style={styles.inputRow}>
        <Image source={images.login} style={styles.logo} />
        <InputWrap
          style={styles.input}
          placeholder="아이디"
          value={username}
          selectionColor={colors.white}
          onChange={setUsername}
          maxLength={50}
          borderBottomColor={{borderBottomColor: colors.white}}
        />
        <InputWrap
          style={styles.input2}
          placeholder="비밀번호"
          selectionColor={colors.white}
          secure
          value={password}
          onChange={setPassword}
          maxLength={20}
          message={passwordError}
          messageColor={colors.red}
          borderBottomColor={{borderBottomColor: colors.white}}
        />
      </View>

      <View style={styles.row}>
        <ButtonWrap
          loading={loading}
          onPress={signInWithApp}
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
          <Avatar
            style={styles.avator}
            source={images.naverIcon}
            onPress={signInWithNaver}
          />
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.avatarTitle}>
            네이버
          </TextWrap>
        </View>
        <View>
          <Avatar
            style={styles.avator}
            source={images.facebookIcon}
            onPress={signWithFacebook}
          />
          <TextWrap
            font={fonts.kopubWorldDotumProMedium}
            style={styles.avatarTitle}>
            페이스북
          </TextWrap>
        </View>

        <View>
          <Avatar
            style={styles.avator}
            source={images.googleIcon}
            onPress={signInWithGoogle}
          />
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
